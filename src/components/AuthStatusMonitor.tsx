import React, { useEffect, useState } from 'react';
import { refreshToken, isLoggedIn } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { useApiStatus } from '../context/ApiStatusContext';

/**
 * Silent component that monitors authentication status and
 * handles auto-refresh of tokens when needed.
 */
const AuthStatusMonitor: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const { showToast } = useToast();
  const { isApiAvailable } = useApiStatus();
  
  // Check auth status periodically
  useEffect(() => {
    // Don't run checks if API is down
    if (!isApiAvailable) return;
    
    const checkAuth = async () => {
      if (checking) return;
      
      try {
        setChecking(true);
        
        // Check if user is logged in with valid session
        const valid = isLoggedIn();
        
        if (!valid) {
          console.log('Session appears to be invalid, attempting refresh');
          const refreshed = await refreshToken();
          
          if (refreshed) {
            console.log('Session refreshed successfully');
          } else {
            console.log('Session refresh failed');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setChecking(false);
      }
    };

    // Check after initial delay
    const initialTimeout = setTimeout(checkAuth, 5000);
    
    // Then check periodically (every 10 minutes instead of 5)
    const interval = setInterval(checkAuth, 10 * 60 * 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isApiAvailable, checking]);
  
  // Also check when API status changes (but only once)
  useEffect(() => {
    if (isApiAvailable && !checking) {
      // API just became available, check auth after a delay
      const timeout = setTimeout(() => {
        const valid = isLoggedIn();
        if (!valid) {
          console.log('API is available but session invalid, trying refresh');
          refreshToken();
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isApiAvailable]);
  
  // This component doesn't render anything
  return null;
};

export default AuthStatusMonitor; 