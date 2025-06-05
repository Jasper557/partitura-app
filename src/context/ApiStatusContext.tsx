import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL, checkApiHealth } from '../config/api';
import { useToast } from './ToastContext';
import { isLoggedIn, refreshToken } from '../services/authService';

interface ApiStatusContextType {
  isApiAvailable: boolean;
  isTokenValid: boolean;
  retryConnection: () => Promise<boolean>;
  validateAuth: () => Promise<boolean>;
  lastChecked: Date | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [healthCheckCount, setHealthCheckCount] = useState<number>(0);
  const { showToast } = useToast();

  const checkApiStatus = async (): Promise<boolean> => {
    try {
      const isAvailable = await checkApiHealth();
      setIsApiAvailable(isAvailable);
      setLastChecked(new Date());
      
      // Reset health check count on success
      if (isAvailable) {
        setHealthCheckCount(0);
        // If API is available, also check token validity
        validateAuth();
      } else {
        setHealthCheckCount(prev => prev + 1);
      }
      
      return isAvailable;
    } catch (error) {
      console.warn('API status check failed:', error);
      setIsApiAvailable(false);
      setLastChecked(new Date());
      setHealthCheckCount(prev => prev + 1);
      return false;
    }
  };

  const validateAuth = async (): Promise<boolean> => {
    try {
      // Check if user is logged in with valid session
      const valid = isLoggedIn();
      
      // Update state based on result
      setIsTokenValid(valid);
      
      // If token is invalid or needs refresh, try to refresh it
      if (!valid) {
        console.log('Token validation failed, attempting refresh');
        const refreshed = await refreshToken();
        
        // Update state after refresh attempt
        setIsTokenValid(refreshed);
        return refreshed;
      }
      
      return valid;
    } catch (error) {
      console.error('Auth validation error:', error);
      setIsTokenValid(false);
      return false;
    }
  };

  const retryConnection = async (): Promise<boolean> => {
    if (isRetrying) return isApiAvailable;
    
    setIsRetrying(true);
    
    try {
      const available = await checkApiStatus();
      
      if (available) {
        const tokenValid = await validateAuth();
        
        if (tokenValid) {
          showToast('Connection restored!', 'success');
        } else {
          showToast('Connected to API, but authentication failed', 'warning');
        }
      } else {
        showToast('API is still unavailable', 'error');
      }
      
      return available;
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    // Initial check after a short delay to avoid immediate spam
    const initialTimeout = setTimeout(() => {
      checkApiStatus();
    }, 2000);
    
    // Set up periodic checks with increasing intervals if API is failing
    const intervalId = setInterval(() => {
      // Skip checks if we've failed too many times recently
      if (healthCheckCount > 5) {
        console.log('Skipping health check due to repeated failures');
        return;
      }

      if (!isApiAvailable) {
        // If API was down, check if it's back up (less frequently after failures)
        const backoffDelay = Math.min(healthCheckCount * 5000, 30000); // Max 30 seconds
        setTimeout(() => {
          checkApiStatus().then(available => {
            if (available && !isApiAvailable) {
              showToast('API connection restored!', 'success');
            }
          });
        }, backoffDelay);
      } else {
        // If API is up, periodically refresh status (less frequently)
        if (lastChecked && (new Date().getTime() - lastChecked.getTime() > 300000)) { // 5 minutes
          checkApiStatus();
        }
        
        // Also periodically validate auth token
        if (!isTokenValid) {
          validateAuth().then(valid => {
            if (valid && !isTokenValid) {
              showToast('Authentication restored!', 'success');
            }
          });
        }
      }
    }, 60000); // Check every minute instead of every 30 seconds
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [isApiAvailable, isTokenValid, lastChecked, healthCheckCount]);

  return (
    <ApiStatusContext.Provider 
      value={{ 
        isApiAvailable, 
        isTokenValid,
        retryConnection, 
        validateAuth,
        lastChecked 
      }}
    >
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = () => {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error('useApiStatus must be used within an ApiStatusProvider');
  }
  return context;
}; 