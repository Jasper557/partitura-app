import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import axios from 'axios'
import { invoke } from '@tauri-apps/api/core'
import { buildApiUrl } from '../config/api'
import {
  initializeAuth,
  isLoggedIn,
  getCurrentUser,
  setAuthSession,
  logout as authLogout,
  addEventListener,
  removeEventListener,
  createAuthInterceptor,
  getAuthToken,
  validateSession,
} from '../services/authService'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Use a fixed port for authentication callbacks to match OAuth provider configuration
const AUTH_CALLBACK_PORT = 43123

// Create axios instance with auth interceptor
const axiosWithAuth = axios.create()
createAuthInterceptor(axiosWithAuth)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate isAuthenticated based on actual state, not during render
  const isAuthenticated = isInitialized && !!user && isLoggedIn()

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initialize authentication on mount - do this first
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('AuthContext: Initializing auth...')
        const isAuthInitialized = await initializeAuth()
        
        if (isAuthInitialized) {
          const currentUser = getCurrentUser()
          console.log('AuthContext: Auth initialized with user:', currentUser?.email)
          setUser(currentUser)
        } else {
          console.log('AuthContext: Auth initialized without user, trying session validation...')
          
          // Try to validate and repair session as fallback
          const sessionValid = await validateSession()
          if (sessionValid) {
            const currentUser = getCurrentUser()
            console.log('AuthContext: Session validation recovered user:', currentUser?.email)
            setUser(currentUser)
          } else {
            console.log('AuthContext: No valid session found')
            setUser(null)
          }
        }
        
        setIsInitialized(true)
      } catch (err) {
        console.error('AuthContext: Error initializing auth:', err)
        setError('Failed to initialize authentication')
        setUser(null)
        setIsInitialized(true)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  // Set up auth event handlers after initialization
  useEffect(() => {
    if (!isInitialized) return

    const handleLogin = (data: { user: User }) => {
      console.log('Auth event: User logged in:', data.user.email)
      setUser(data.user)
      setError(null)
    }

    const handleLogout = () => {
      console.log('Auth event: User logged out')
      setUser(null)
      setError(null)
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    const handleTokenRefreshed = () => {
      // Update user state with current user from auth service
      const currentUser = getCurrentUser()
      console.log('Auth event: Token refreshed, updating user:', currentUser?.email)
      setUser(currentUser)
    }

    const handleAuthError = (data: { reason: string; error?: any }) => {
      console.error('Auth event: Auth error:', data)
      
      switch (data.reason) {
        case 'refresh_failed':
          setError('Your session has expired. Please log in again.')
          break
        case 'refresh_error':
          setError('Authentication error. Please try logging in again.')
          break
        default:
          setError('An authentication error occurred.')
      }
    }

    // Subscribe to auth events
    addEventListener('login', handleLogin)
    addEventListener('logout', handleLogout)
    addEventListener('token_refreshed', handleTokenRefreshed)
    addEventListener('auth_error', handleAuthError)

    // Cleanup
    return () => {
      removeEventListener('login', handleLogin)
      removeEventListener('logout', handleLogout)
      removeEventListener('token_refreshed', handleTokenRefreshed)
      removeEventListener('auth_error', handleAuthError)
    }
  }, [isInitialized])

  // Listen for Supabase auth changes as backup (with WebSocket resilience)
  useEffect(() => {
    if (!isInitialized) return

    let reconnectTimeout: NodeJS.Timeout | null = null;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase auth change:', event, session?.user?.email)
      
      // Ignore certain events that can be triggered by WebSocket issues
      if (event === 'SIGNED_OUT') {
        const currentServiceUser = getCurrentUser()
        
        // Only process SIGNED_OUT if we actually have a user and this wasn't caused by suspension
        if (currentServiceUser && !document.hidden) {
          console.log('Supabase signed out (confirmed), syncing with service')
          await authLogout()
        } else {
          console.log('Ignoring Supabase signed out event (likely due to tab suspension or WebSocket issue)')
          
          // Set a timeout to check if we can recover the session
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(async () => {
            if (currentServiceUser) {
              console.log('Attempting to recover Supabase session after suspension')
              try {
                // Try to refresh the session to restore Supabase state
                const { data, error } = await supabase.auth.getSession();
                if (!data.session && !error) {
                  // If no session and no error, check if we have a valid token from our service
                  const authToken = await getAuthToken();
                  if (currentServiceUser && authToken) {
                    console.log('Service has valid token, but Supabase session lost - this is expected after suspension');
                    // Don't try to force restore here, let the auth service handle it naturally
                  }
                }
              } catch (recoverError) {
                console.log('Session recovery failed:', recoverError);
              }
            }
          }, 2000); // Wait 2 seconds before attempting recovery
        }
        return;
      }
      
      // Handle initial session restore or silent refresh
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
        const currentServiceUser = getCurrentUser()
        
        // If service doesn't have user but supabase does, sync them
        if (!currentServiceUser && session?.user) {
          console.log('Syncing Supabase session to auth service')
          await setAuthSession(session)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    }
  }, [isInitialized])

  // Handle page visibility changes to prevent auth issues during tab suspension
  useEffect(() => {
    if (!isInitialized) return;

    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        // Tab became visible again, check if we still have a valid session
        console.log('Tab became visible, checking auth state...');
        
        // Small delay to let WebSocket connections re-establish
        setTimeout(async () => {
          try {
            const authToken = await getAuthToken();
            if (!authToken) {
              console.log('No valid token after tab visibility, user might need to re-login');
              // Don't force logout here, let the circuit breaker handle it
            } else {
              console.log('Auth token still valid after tab visibility');
            }
          } catch (error) {
            console.log('Error checking auth state after visibility change:', error);
          }
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, user]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting Google sign in...')
      
      // Use the fixed port for the callback
      const localPort = AUTH_CALLBACK_PORT
      const callbackUrl = `http://localhost:${localPort}/auth-callback`
      
      // Get the OAuth URL from our API
      const response = await axiosWithAuth.get(buildApiUrl('/auth/google/url'), {
        params: { redirectUrl: callbackUrl }
      })
      
      const { url } = response.data
      console.log('Opening OAuth URL:', url)
      
      // Open URL using the Tauri command
      try {
        await invoke('open_url_in_browser', { url })
      } catch (err) {
        console.log('Tauri browser open failed, falling back to window.open')
        window.open(url, "_blank")
      }
      
      // Listen for the callback on our local server
      console.log('Waiting for auth callback...')
      const accessToken = await invoke<string>('listen_for_auth_callback', { 
        port: localPort,
        timeout: 300 // 5 minutes timeout
      })
      
      if (!accessToken) {
        throw new Error("No access token received from authentication callback")
      }
      
      console.log('Received access token, exchanging for session...')
      
      // Exchange the token for a session
      const sessionResponse = await axiosWithAuth.post(buildApiUrl('/auth/session'), {
        code: accessToken
      })
      
      if (!sessionResponse.data?.session) {
        throw new Error("Failed to exchange token for session")
      }
      
      console.log('Session received, setting auth session...')
      
      // Set the authentication session using our auth service
      await setAuthSession(sessionResponse.data.session)
      
      console.log('Google sign in completed successfully')
      
    } catch (error: any) {
      console.error('Authentication error:', error)
      
      // Set user-friendly error messages
      if (error.message?.includes('timeout')) {
        setError('Authentication timed out. Please try again.')
      } else if (error.message?.includes('token')) {
        setError('Failed to complete authentication. Please try again.')
      } else if (error.response?.status >= 500) {
        setError('Server error during authentication. Please try again later.')
      } else {
        setError('Authentication failed. Please try again.')
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting email sign in for:', email)
      
      // Call our API to sign in with email
      const response = await axiosWithAuth.post(buildApiUrl('/auth/signin'), {
        email,
        password
      })
      
      if (!response.data?.session) {
        throw new Error('Failed to sign in with email')
      }
      
      console.log('Email sign in successful, setting auth session...')
      
      // Set the authentication session using our auth service
      await setAuthSession(response.data.session)
      
      console.log('Email sign in completed successfully')
      
    } catch (error: any) {
      console.error('Email sign in error:', error)
      
      // Set user-friendly error messages
      if (error.response?.status === 401) {
        setError(error.response.data?.message || 'Invalid email or password')
      } else if (error.response?.status === 429) {
        setError('Too many sign in attempts. Please wait a moment and try again.')
      } else if (error.response?.status >= 500) {
        setError('Server error during sign in. Please try again later.')
      } else {
        setError(error.response?.data?.message || 'Sign in failed. Please try again.')
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting email sign up for:', email)
      
      // Call our API to sign up with email
      const response = await axiosWithAuth.post(buildApiUrl('/auth/signup'), {
        email,
        password,
        firstName,
        lastName
      })
      
      console.log('Email sign up response:', response.data)
      
      // Handle different signup scenarios
      if (response.data?.needsEmailConfirmation) {
        // Email confirmation required
        setError('Account created! Please check your email to confirm your account before signing in.')
        return
      }
      
      if (response.data?.session) {
        console.log('Email sign up successful, setting auth session...')
        
        // Set the authentication session using our auth service
        await setAuthSession(response.data.session)
        
        console.log('Email sign up completed successfully')
      } else {
        throw new Error('Sign up succeeded but no session received')
      }
      
    } catch (error: any) {
      console.error('Email sign up error:', error)
      
      // Set user-friendly error messages
      if (error.response?.status === 409) {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Invalid email or password format')
      } else if (error.response?.status >= 500) {
        setError('Server error during sign up. Please try again later.')
      } else {
        setError(error.response?.data?.message || 'Sign up failed. Please try again.')
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Sending password reset email to:', email)
      
      // Call our API to send password reset email
      const response = await axiosWithAuth.post(buildApiUrl('/auth/reset-password'), {
        email
      })
      
      console.log('Password reset email sent successfully')
      
      // Show success message (API returns same message for security)
      setError('If an account with that email exists, you will receive a password reset link.')
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      // Set user-friendly error messages
      if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Please enter a valid email address')
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError('Failed to send reset email. Please try again.')
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Logging out...')
      await authLogout()
      // The logout event handler will update the user state
    } catch (error) {
      console.error('Logout error:', error)
      // Force state update even if logout fails
      setUser(null)
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debug logging in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Auth state:', { 
        user: user?.email, 
        loading, 
        isAuthenticated, 
        isInitialized,
        error 
      })
    }
  }, [user, loading, isAuthenticated, isInitialized, error])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated,
        signInWithGoogle, 
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout, 
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 