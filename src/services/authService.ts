import { supabase } from '../config/supabase';
import { buildApiUrl } from '../config/api';
import { User } from '@supabase/supabase-js';

// Define session storage keys
const AUTH_STORAGE_KEY = 'partitura-auth';
const SUPABASE_KEY = 'sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1] + '-auth-token';
const BACKUP_KEY = 'partitura-auth-backup';

// Token refresh configuration
const REFRESH_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  cooldownPeriod: 5 * 60 * 1000, // 5 minutes cooldown after max retries
};

// Global suspension detection
let isSuspected = false;
let lastSuspensionTime = 0;
const SUSPENSION_DETECTION_THRESHOLD = 30000; // 30 seconds

// Monitor for suspension by tracking time gaps
let lastHeartbeat = Date.now();

// Global circuit breaker to prevent endless refresh loops
let globalRefreshBlocked = false;
let globalRefreshBlockedUntil = 0;

// Global rate limiter for auth operations
const authRateLimiter = {
  lastOperation: 0,
  minInterval: 1000, // Minimum 1 second between operations
  blockedOperations: 0,
  
  canProceed(): boolean {
    const now = Date.now();
    if (now - this.lastOperation < this.minInterval) {
      this.blockedOperations++;
      console.log(`AuthService: Rate limiter blocking operation (${this.blockedOperations} total blocked)`);
      return false;
    }
    this.lastOperation = now;
    return true;
  }
};

// Circuit breaker statistics
const circuitBreakerStats = {
  activations: 0,
  totalBlockedCalls: 0,
  
  recordActivation(): void {
    this.activations++;
    console.log(`AuthService: Circuit breaker activation #${this.activations}`);
  },
  
  recordBlockedCall(): void {
    this.totalBlockedCalls++;
  }
};

// Interval management
let heartbeatInterval: NodeJS.Timeout | null = null;
let consistencyCheckInterval: NodeJS.Timeout | null = null;
let refreshIntervalId: NodeJS.Timeout | null = null;
let autoRefreshCleanup: (() => void) | null = null;

// Auth state management
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isRefreshing: boolean;
  refreshPromise: Promise<boolean> | null;
  retryCount: number;
}

let authState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isRefreshing: false,
  refreshPromise: null,
  retryCount: 0,
};

// Event listeners for auth state changes
type AuthEventType = 'login' | 'logout' | 'token_refreshed' | 'auth_error';
type AuthEventListener = (data?: any) => void;

const eventListeners: Record<AuthEventType, AuthEventListener[]> = {
  login: [],
  logout: [],
  token_refreshed: [],
  auth_error: [],
};

/**
 * Add event listener for auth events
 */
export const addEventListener = (event: AuthEventType, listener: AuthEventListener): void => {
  eventListeners[event].push(listener);
};

/**
 * Remove event listener
 */
export const removeEventListener = (event: AuthEventType, listener: AuthEventListener): void => {
  const index = eventListeners[event].indexOf(listener);
  if (index > -1) {
    eventListeners[event].splice(index, 1);
  }
};

/**
 * Emit auth event
 */
const emitEvent = (event: AuthEventType, data?: any): void => {
  eventListeners[event].forEach(listener => {
    try {
      listener(data);
    } catch (error) {
      console.error(`Error in auth event listener for ${event}:`, error);
    }
  });
};

// Session storage helpers
const SessionStorage = {
  // Save session to all storage locations
  saveSession: (session: any) => {
    try {
      // Format session data
      const authData = {
        user: session.user,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + (3600 * 1000),
        lastUpdated: Date.now()
      };
      
      // Save to our primary storage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      // Save backup
      localStorage.setItem(BACKUP_KEY, JSON.stringify(authData));
      
      console.log('AuthService: Session saved to all storage locations');
    } catch (error) {
      console.error('AuthService: Error saving session:', error);
    }
  },
  
  // Load session from best available source
  loadSession: (): any => {
    try {
      // Try primary storage first
      const primaryData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (primaryData) {
        const parsed = JSON.parse(primaryData);
        if (parsed.user && parsed.accessToken) {
          return parsed;
        }
      }
      
      // Try Supabase storage
      const supabaseData = localStorage.getItem(SUPABASE_KEY);
      if (supabaseData) {
        const parsed = JSON.parse(supabaseData);
        if (parsed.user && parsed.access_token) {
          // Convert to our format
          return {
            user: parsed.user,
            accessToken: parsed.access_token,
            refreshToken: parsed.refresh_token,
            expiresAt: parsed.expires_at ? parsed.expires_at * 1000 : null,
            lastUpdated: Date.now()
          };
        }
      }
      
      // Try backup storage
      const backupData = localStorage.getItem(BACKUP_KEY);
      if (backupData) {
        const parsed = JSON.parse(backupData);
        if (parsed.user && parsed.accessToken) {
          return parsed;
        }
      }
      
      return null;
    } catch (error) {
      console.error('AuthService: Error loading session:', error);
      return null;
    }
  },
  
  // Clear all session storage
  clearSession: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      // Don't remove Supabase storage - let Supabase handle that
      console.log('AuthService: Session storage cleared');
    } catch (error) {
      console.error('AuthService: Error clearing session:', error);
    }
  }
};

/**
 * Initialize authentication from stored session
 */
export const initializeAuth = async (): Promise<boolean> => {
  try {
    console.log('AuthService: Initializing authentication...');
    
    // First try to get session from Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (data.session && !error) {
      console.log('AuthService: Found valid Supabase session for:', data.session.user?.email);
      updateAuthState(data.session);
      startAutoRefresh(); 
      return true;
    } else if (error) {
      console.log('AuthService: Supabase session error:', error.message);
    } else {
      console.log('AuthService: No Supabase session found');
    }

    // Try to restore from our storage system
    const storedSession = SessionStorage.loadSession();
    if (!storedSession) {
      console.log('AuthService: No stored session found');
      return false;
    }

    console.log('AuthService: Found stored session for:', storedSession.user?.email);
    
    // Check if stored session is expired
    if (storedSession.expiresAt && Date.now() > storedSession.expiresAt) {
      console.log('AuthService: Stored session expired, attempting refresh...');
      
      // Set the refresh token and try to refresh
      authState.refreshToken = storedSession.refreshToken;
      authState.user = storedSession.user; // Set user temporarily for refresh
      
      const refreshed = await refreshToken();
      
      if (refreshed) {
        console.log('AuthService: Session refreshed successfully');
        startAutoRefresh();
        return true;
      } else {
        console.log('AuthService: Failed to refresh expired session');
        SessionStorage.clearSession();
        return false;
      }
    }

    // Session is still valid - restore it
    console.log('AuthService: Restoring valid session');
    authState.user = storedSession.user;
    authState.accessToken = storedSession.accessToken;
    authState.refreshToken = storedSession.refreshToken;
    authState.expiresAt = storedSession.expiresAt;
    
    // Sync with Supabase to ensure consistency
    if (authState.accessToken && authState.refreshToken) {
      try {
        await supabase.auth.setSession({
          access_token: authState.accessToken,
          refresh_token: authState.refreshToken
        });
        console.log('AuthService: Synced restored session with Supabase');
      } catch (supabaseError) {
        console.log('AuthService: Failed to sync with Supabase, but continuing with local session');
      }
    }
    
    startAutoRefresh();
    console.log('AuthService: Session restoration completed successfully');
    return true;

  } catch (error) {
    console.error('AuthService: Error initializing auth:', error);
    SessionStorage.clearSession();
    return false;
  }
};

/**
 * Update auth state with new session data
 */
const updateAuthState = (session: any): void => {
  console.log('AuthService: Updating auth state for user:', session.user?.email)
  
  // Update memory state
  authState.user = session.user;
  authState.accessToken = session.access_token;
  authState.refreshToken = session.refresh_token;
  authState.expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + (3600 * 1000);
  authState.retryCount = 0;

  // Save to persistent storage
  SessionStorage.saveSession(session);
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log('AuthService: Auth state updated:', {
      user: authState.user?.email,
      expiresAt: new Date(authState.expiresAt).toISOString(),
      hasAccessToken: !!authState.accessToken,
      hasRefreshToken: !!authState.refreshToken
    });
  }
};

/**
 * Check if token should be refreshed
 */
const shouldRefreshToken = (): boolean => {
  if (!authState.expiresAt) return false;
  
  const timeUntilExpiry = authState.expiresAt - Date.now();
  return timeUntilExpiry <= REFRESH_CONFIG.refreshThreshold;
};

/**
 * Check if token is expired
 */
const isTokenExpired = (): boolean => {
  if (!authState.expiresAt) return true;
  
  const now = Date.now();
  const expired = now >= authState.expiresAt;
  
  // During suspension, give some grace time before considering token expired
  if (expired && (isSuspected || document.hidden)) {
    const graceTime = 5 * 60 * 1000; // 5 minutes grace period
    const gracefulExpiry = authState.expiresAt + graceTime;
    const stillInGrace = now < gracefulExpiry;
    
    if (stillInGrace) {
      console.log('AuthService: Token expired but still in grace period during suspension');
      return false; // Treat as not expired during grace period
    }
  }
  
  return expired;
};

/**
 * Get current auth token, refreshing if necessary
 */
export const getAuthToken = async (): Promise<string | null> => {
  // If no token, return null
  if (!authState.accessToken) {
    return null;
  }

  // If we're in suspension, be more lenient about expired tokens
  if (isSuspected || document.hidden) {
    console.log('AuthService: Returning token as-is during suspension (avoiding refresh)');
    return authState.accessToken;
  }

  // If token is expired, try to refresh
  if (isTokenExpired()) {
    console.log('AuthService: Token expired, attempting refresh...');
    const refreshed = await refreshToken();
    if (!refreshed) {
      console.log('AuthService: Token refresh failed, returning null');
      return null;
    }
  }
  
  // If token needs refresh soon, refresh in background (but not during suspension)
  else if (shouldRefreshToken() && !authState.isRefreshing && !isSuspected && !document.hidden) {
    console.log('AuthService: Token needs refresh soon, refreshing in background...');
    refreshToken().catch(error => {
      console.warn('Background token refresh failed:', error);
    });
  }

  return authState.accessToken;
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async (): Promise<boolean> => {
  // Check if we're in a suspected suspension state
  if (isSuspected || document.hidden) {
    console.log('AuthService: Skipping token refresh - browser is suspended or tab hidden');
    return false;
  }

  // Check rate limiter first
  if (!authRateLimiter.canProceed()) {
    console.log('AuthService: Token refresh rate limited');
    return false;
  }

  // Check global circuit breaker
  if (globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil) {
    circuitBreakerStats.recordBlockedCall();
    console.log('AuthService: Token refresh blocked by circuit breaker');
    return false;
  }

  // If already refreshing, wait for the existing promise
  if (authState.isRefreshing && authState.refreshPromise) {
    console.log('AuthService: Already refreshing, waiting for existing promise');
    return authState.refreshPromise;
  }

  // Immediately activate circuit breaker if we've exceeded retries
  if (authState.retryCount >= REFRESH_CONFIG.maxRetries) {
    console.warn('AuthService: Max refresh retries reached, activating circuit breaker immediately');
    
    // Activate global circuit breaker
    globalRefreshBlocked = true;
    globalRefreshBlockedUntil = Date.now() + REFRESH_CONFIG.cooldownPeriod;
    circuitBreakerStats.recordActivation();
    
    // Reset retry count
    authState.retryCount = 0;
    authState.isRefreshing = false;
    authState.refreshPromise = null;
    
    console.log(`AuthService: Circuit breaker activated for ${REFRESH_CONFIG.cooldownPeriod / 1000} seconds`);
    return false;
  }

  // Start refresh process
  console.log(`AuthService: Starting token refresh attempt ${authState.retryCount + 1}/${REFRESH_CONFIG.maxRetries}`);
  authState.isRefreshing = true;
  authState.retryCount++;

  authState.refreshPromise = new Promise(async (resolve) => {
    try {
      // Add exponential backoff delay for retries
      if (authState.retryCount > 1) {
        const delay = REFRESH_CONFIG.retryDelay * Math.pow(2, authState.retryCount - 1);
        console.log(`AuthService: Waiting ${delay}ms before retry attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Try Supabase refresh first
      console.log('AuthService: Attempting Supabase refresh...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (data.session && !error) {
        console.log('AuthService: Supabase refresh successful');
        updateAuthState(data.session);
        emitEvent('token_refreshed');
        
        // Reset everything on success
        authState.isRefreshing = false;
        authState.refreshPromise = null;
        authState.retryCount = 0;
        globalRefreshBlocked = false;
        globalRefreshBlockedUntil = 0;
        
        resolve(true);
        return;
      } else {
        console.log('AuthService: Supabase refresh failed:', error?.message);
      }

      // Fallback to manual refresh with stored refresh token
      if (authState.refreshToken) {
        console.log('AuthService: Attempting manual refresh with stored token...');
        try {
          const response = await fetch(buildApiUrl('/auth/refresh'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: authState.refreshToken }),
            credentials: 'include',
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });

          if (response.ok) {
            const refreshData = await response.json();
            if (refreshData?.session) {
              console.log('AuthService: Manual refresh successful');
              updateAuthState(refreshData.session);
              
              // Update Supabase session
              await supabase.auth.setSession({
                access_token: refreshData.session.access_token,
                refresh_token: refreshData.session.refresh_token
              });

              emitEvent('token_refreshed');
              
              // Reset everything on success
              authState.isRefreshing = false;
              authState.refreshPromise = null;
              authState.retryCount = 0;
              globalRefreshBlocked = false;
              globalRefreshBlockedUntil = 0;
              
              resolve(true);
              return;
            }
          } else {
            console.log(`AuthService: Manual refresh failed with status ${response.status}`);
          }
        } catch (fetchError) {
          console.log('AuthService: Fetch error during token refresh (server likely unavailable):', fetchError);
        }
      }

      // All refresh attempts failed for this try
      console.error(`AuthService: Token refresh attempt ${authState.retryCount} failed`);
      
      // Check if we should activate circuit breaker
      if (authState.retryCount >= REFRESH_CONFIG.maxRetries) {
        console.warn('AuthService: Activating circuit breaker due to repeated failures');
        globalRefreshBlocked = true;
        globalRefreshBlockedUntil = Date.now() + REFRESH_CONFIG.cooldownPeriod;
        circuitBreakerStats.recordActivation();
        
        // Clear refresh state
        authState.isRefreshing = false;
        authState.refreshPromise = null;
        authState.retryCount = 0; // Reset for next cycle
        
        console.log(`AuthService: Circuit breaker activated for ${REFRESH_CONFIG.cooldownPeriod / 1000} seconds`);
      } else {
        // Just clear the refreshing state, keep retryCount for next attempt
        authState.isRefreshing = false;
        authState.refreshPromise = null;
      }
      
      resolve(false);

    } catch (error) {
      console.error('AuthService: Unexpected error during token refresh:', error);
      
      // Clear refresh state but don't activate circuit breaker for unexpected errors
      authState.isRefreshing = false;
      authState.refreshPromise = null;
      resolve(false);
    }
  });

  return authState.refreshPromise;
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  const hasUser = !!authState.user;
  const hasAccessToken = !!authState.accessToken;
  const isNotExpired = !isTokenExpired();
  
  const loggedIn = hasUser && hasAccessToken && isNotExpired;
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('AuthService: Login status check:', {
      hasUser,
      hasAccessToken: hasAccessToken ? 'Yes' : 'No',
      isNotExpired,
      expiresAt: authState.expiresAt ? new Date(authState.expiresAt).toISOString() : 'No expiry',
      now: new Date().toISOString(),
      result: loggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'
    });
  }
  
  return loggedIn;
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return authState.user;
};

/**
 * Get current user ID
 */
export const getCurrentUserId = (): string | null => {
  return authState.user?.id || null;
};

/**
 * Set authentication session
 */
export const setAuthSession = async (session: any): Promise<void> => {
  try {
    console.log('AuthService: Setting auth session for user:', session.user?.email)
    
    // Update our auth state first
    updateAuthState(session);
    
    // Also update Supabase session to keep them in sync
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    
    // Emit login event to notify components
    emitEvent('login', { user: authState.user });
    
    console.log('AuthService: Auth session set successfully')
  } catch (error) {
    console.error('AuthService: Error setting auth session:', error)
    // Still emit the event even if Supabase sync fails
    emitEvent('login', { user: authState.user });
  }
};

/**
 * Clear authentication state and log out
 */
export const logout = async (): Promise<void> => {
  try {
    // Stop all intervals and timers first
    cleanupAllIntervals();
    
    // Clear memory state first
    authState = {
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isRefreshing: false,
      refreshPromise: null,
      retryCount: 0,
    };

    // Clear all storage
    SessionStorage.clearSession();
    
    // Reset circuit breaker and rate limiter
    globalRefreshBlocked = false;
    globalRefreshBlockedUntil = 0;
    authRateLimiter.blockedOperations = 0;
    circuitBreakerStats.activations = 0;
    circuitBreakerStats.totalBlockedCalls = 0;
    
    // Emit logout event
    emitEvent('logout');

    // Sign out from Supabase (don't wait for response)
    supabase.auth.signOut().catch(() => {
      // Ignore errors during sign out
    });

  } catch (error) {
    console.error('AuthService: Error during logout:', error);
    // Force clear everything anyway
    SessionStorage.clearSession();
    emitEvent('logout');
  }
};

/**
 * Handle authentication errors (401/403)
 * Returns true if error was handled, false if should redirect to login
 */
export const handleAuthError = async (status: number): Promise<boolean> => {
  console.log(`AuthService: Handling auth error - status: ${status}`);
  
  // Don't try to refresh if circuit breaker is active
  if (globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil) {
    console.log('AuthService: Auth error handling blocked by circuit breaker, server likely down');
    return false; // Don't redirect to login when server is down
  }

  // For 401 errors, try to refresh the token
  if (status === 401 && authState.refreshToken) {
    console.log('AuthService: Attempting token refresh for 401 error');
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      console.log('AuthService: Token refresh successful, request can be retried');
      return true; // Token refreshed, request can be retried
    } else {
      console.log('AuthService: Token refresh failed for 401 error');
      // Don't logout immediately - let circuit breaker handle it
      return false;
    }
  }

  // For 403 errors, token is likely invalid
  if (status === 403) {
    console.log('AuthService: 403 error - token likely invalid, logging out');
    await logout();
    return false;
  }

  return false;
};

/**
 * Create an axios interceptor for automatic token management
 */
export const createAuthInterceptor = (axiosInstance: any) => {
  // Request interceptor to add auth token
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  // Response interceptor to handle auth errors
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;
      
      // Don't retry if circuit breaker is active (server likely down)
      if (globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil) {
        console.log('AuthService: Axios interceptor blocked by circuit breaker, server likely down');
        return Promise.reject(error);
      }
      
      // Don't retry during suspension
      if (isSuspected || document.hidden) {
        console.log('AuthService: Axios interceptor skipping retry during suspension');
        return Promise.reject(error);
      }
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        console.log('AuthService: Axios interceptor attempting token refresh for 401');
        const refreshed = await refreshToken();
        
        if (refreshed) {
          const token = await getAuthToken();
          if (token) {
            console.log('AuthService: Axios interceptor retrying request with new token');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } else {
          console.log('AuthService: Axios interceptor token refresh failed, not retrying');
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Export auth state for debugging (development only)
if (import.meta.env.DEV) {
  (window as any).__authState = authState;
}

/**
 * Start automatic token refresh
 */
const startAutoRefresh = () => {
  // Clear any existing interval
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }

  const checkAndRefresh = async () => {
    // Don't check if circuit breaker is active
    if (globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil) {
      return;
    }

    // Don't refresh if tab is hidden (suspended)
    if (document.hidden) {
      console.log('AuthService: Skipping auto-refresh while tab is hidden');
      return;
    }

    // Don't refresh if not authenticated
    if (!isLoggedIn()) {
      return;
    }

    // Check if token needs refresh
    if (shouldRefreshToken()) {
      console.log('AuthService: Auto-refreshing token');
      const success = await refreshToken();
      
      if (!success) {
        console.log('AuthService: Auto-refresh failed, will retry later or wait for circuit breaker reset');
      }
    }
  };

  // Check every 30 seconds (reduced from 60 seconds)
  refreshIntervalId = setInterval(checkAndRefresh, 30000);
  
  // Also check immediately
  checkAndRefresh();

  // Listen for page visibility changes to handle suspend/resume
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Tab became visible, trigger a check after a short delay
      console.log('AuthService: Tab visible again, checking auth state');
      setTimeout(checkAndRefresh, 2000);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Return cleanup function
  const cleanup = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
  
  // Store cleanup function globally for manual cleanup if needed
  autoRefreshCleanup = cleanup;
  
  return cleanup;
};

/**
 * Reset the global circuit breaker (for debugging or manual recovery)
 */
export const resetCircuitBreaker = () => {
  console.log('AuthService: Manually resetting circuit breaker');
  globalRefreshBlocked = false;
  globalRefreshBlockedUntil = 0;
  authState.retryCount = 0;
};

/**
 * Reset all statistics (for debugging)
 */
export const resetStatistics = () => {
  console.log('AuthService: Resetting all statistics');
  circuitBreakerStats.activations = 0;
  circuitBreakerStats.totalBlockedCalls = 0;
  authRateLimiter.blockedOperations = 0;
};

/**
 * Get circuit breaker status (for debugging)
 */
export const getCircuitBreakerStatus = () => ({
  isBlocked: globalRefreshBlocked,
  blockedUntil: globalRefreshBlockedUntil,
  retryCount: authState.retryCount,
  timeRemaining: globalRefreshBlocked ? Math.max(0, globalRefreshBlockedUntil - Date.now()) : 0,
  suspension: {
    isSuspected,
    lastSuspensionTime,
    timeSinceLastSuspension: lastSuspensionTime ? Date.now() - lastSuspensionTime : 0,
    documentHidden: document.hidden
  },
  statistics: {
    circuitBreakerActivations: circuitBreakerStats.activations,
    totalBlockedCalls: circuitBreakerStats.totalBlockedCalls,
    rateLimiterBlocks: authRateLimiter.blockedOperations
  }
});

// Add circuit breaker debugging functions (development only)
if (import.meta.env.DEV) {
  (window as any).__authDebug = {
    getCircuitBreakerStatus,
    resetCircuitBreaker,
    resetStatistics,
    getAuthState: () => ({ ...authState }),
    isCircuitBreakerActive: () => globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil,
    timeUntilReset: () => globalRefreshBlocked ? Math.max(0, Math.ceil((globalRefreshBlockedUntil - Date.now()) / 1000)) : 0,
    getStatistics: () => ({
      circuitBreaker: {
        activations: circuitBreakerStats.activations,
        totalBlockedCalls: circuitBreakerStats.totalBlockedCalls,
        isActive: globalRefreshBlocked && Date.now() < globalRefreshBlockedUntil
      },
      rateLimiter: {
        blockedOperations: authRateLimiter.blockedOperations,
        lastOperation: authRateLimiter.lastOperation,
        minInterval: authRateLimiter.minInterval
      },
      refresh: {
        retryCount: authState.retryCount,
        isRefreshing: authState.isRefreshing,
        maxRetries: REFRESH_CONFIG.maxRetries
      },
      suspension: {
        isSuspected,
        lastSuspensionTime: lastSuspensionTime ? new Date(lastSuspensionTime).toISOString() : 'Never',
        timeSinceLastSuspension: lastSuspensionTime ? Date.now() - lastSuspensionTime : 0,
        documentHidden: document.hidden,
        heartbeatActive: !!heartbeatInterval
      }
    })
  };
  
  console.log('AuthService: Debug functions available at window.__authDebug');
  console.log('AuthService: Use __authDebug.getStatistics() to view protection statistics');
}

/**
 * Stop automatic token refresh
 */
const stopAutoRefresh = () => {
  if (autoRefreshCleanup) {
    console.log('AuthService: Stopping auto-refresh');
    autoRefreshCleanup();
    autoRefreshCleanup = null;
  }
};

/**
 * Clean up all intervals and listeners
 */
const cleanupAllIntervals = () => {
  stopAutoRefresh();
  
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    console.log('AuthService: Stopped suspension detection heartbeat');
  }
  
  if (consistencyCheckInterval) {
    clearInterval(consistencyCheckInterval);
    console.log('AuthService: Stopped session consistency checks');
  }
  
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
};

/**
 * Validate and repair session consistency
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    console.log('AuthService: Validating session consistency...');
    
    // Helper function to safely check stored session
    const getStoredSession = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return (parsed.user && parsed.accessToken && parsed.refreshToken) ? parsed : null;
      } catch {
        return null;
      }
    };
    
    // Check all session sources
    const storedSession = getStoredSession();
    const hasMemorySession = !!(authState.user && authState.accessToken);
    
    // Check Supabase state
    const { data } = await supabase.auth.getSession();
    const hasSupabaseSession = !!(data.session && data.session.user);
    
    console.log('AuthService: Session validation status:', {
      localStorage: storedSession ? 'Valid' : 'Empty',
      memory: hasMemorySession ? 'Valid' : 'Empty', 
      supabase: hasSupabaseSession ? 'Valid' : 'Empty'
    });
    
    // If all are empty, user is not logged in
    if (!storedSession && !hasMemorySession && !hasSupabaseSession) {
      console.log('AuthService: No session found anywhere - user not logged in');
      return false;
    }
    
    // If we have Supabase session but missing memory/localStorage, restore
    if (hasSupabaseSession && (!hasMemorySession || !storedSession)) {
      console.log('AuthService: Restoring session from Supabase...');
      updateAuthState(data.session);
      startAutoRefresh();
      return true;
    }
    
    // If we have localStorage but missing memory, restore memory
    if (storedSession && !hasMemorySession) {
      console.log('AuthService: Restoring session from localStorage to memory...');
      authState.user = storedSession.user;
      authState.accessToken = storedSession.accessToken;
      authState.refreshToken = storedSession.refreshToken;
      authState.expiresAt = storedSession.expiresAt;
      
      // Also sync with Supabase if needed
      if (!hasSupabaseSession) {
        try {
          await supabase.auth.setSession({
            access_token: storedSession.accessToken,
            refresh_token: storedSession.refreshToken
          });
          console.log('AuthService: Synced localStorage session with Supabase');
        } catch (error) {
          console.log('AuthService: Failed to sync with Supabase:', error);
        }
      }
      
      startAutoRefresh();
      return true;
    }
    
    // Session appears valid
    return hasMemorySession;
    
  } catch (error) {
    console.error('AuthService: Error validating session:', error);
    return false;
  }
};

/**
 * Check session consistency across all storage locations
 */
const checkSessionConsistency = async () => {
  try {
    // Skip check during suspension
    if (isSuspected || document.hidden) {
      return;
    }

    const memorySession = authState.user && authState.accessToken;
    const storedSession = SessionStorage.loadSession();
    const { data } = await supabase.auth.getSession();
    const supabaseSession = data.session;

    // Debug log session state
    if (import.meta.env.DEV) {
      console.log('AuthService: Session consistency check:', {
        memory: memorySession ? 'Valid' : 'Empty',
        stored: storedSession ? 'Valid' : 'Empty',
        supabase: supabaseSession ? 'Valid' : 'Empty'
      });
    }

    // If we have no session anywhere, we're logged out
    if (!memorySession && !storedSession && !supabaseSession) {
      return;
    }

    // If Supabase has a session but we don't, restore it
    if (supabaseSession && (!memorySession || !storedSession)) {
      console.log('AuthService: Restoring session from Supabase');
      updateAuthState(supabaseSession);
      return;
    }

    // If we have a memory session but Supabase doesn't, sync it
    if (memorySession && !supabaseSession && authState.accessToken && authState.refreshToken) {
      console.log('AuthService: Syncing session to Supabase');
      await supabase.auth.setSession({
        access_token: authState.accessToken,
        refresh_token: authState.refreshToken
      });
      return;
    }

    // If we have stored session but no memory session, restore it
    if (storedSession && !memorySession) {
      console.log('AuthService: Restoring session from storage');
      authState.user = storedSession.user;
      authState.accessToken = storedSession.accessToken;
      authState.refreshToken = storedSession.refreshToken;
      authState.expiresAt = storedSession.expiresAt;
      return;
    }

  } catch (error) {
    console.error('AuthService: Error checking session consistency:', error);
  }
};

// Start session consistency checks
consistencyCheckInterval = setInterval(checkSessionConsistency, 30000);

// Start suspension detection heartbeat
heartbeatInterval = setInterval(() => {
  const now = Date.now();
  const timeDiff = now - lastHeartbeat;
  
  // If more than 30 seconds passed, we were probably suspended
  if (timeDiff > SUSPENSION_DETECTION_THRESHOLD) {
    console.log(`AuthService: Suspension detected - gap of ${timeDiff}ms`);
    isSuspected = true;
    lastSuspensionTime = now;
    
    // Clear suspension flag after a delay
    setTimeout(() => {
      isSuspected = false;
      console.log('AuthService: Suspension recovery period ended');
    }, 10000); // 10 second recovery period
  }
  
  lastHeartbeat = now;
}, 5000); // Check every 5 seconds 