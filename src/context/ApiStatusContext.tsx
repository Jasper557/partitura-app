import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config/api';
import { useToast } from './ToastContext';

interface ApiStatusContextType {
  isApiAvailable: boolean;
  retryConnection: () => Promise<boolean>;
  lastChecked: Date | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const { showToast } = useToast();

  const checkApiStatus = async (): Promise<boolean> => {
    try {
      const baseUrl = API_URL.split('/api')[0];
      const healthEndpoint = `${baseUrl}/health`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(healthEndpoint, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const isAvailable = response.ok;
      setIsApiAvailable(isAvailable);
      setLastChecked(new Date());
      
      return isAvailable;
    } catch (error) {
      setIsApiAvailable(false);
      setLastChecked(new Date());
      return false;
    }
  };

  const retryConnection = async (): Promise<boolean> => {
    if (isRetrying) return isApiAvailable;
    
    setIsRetrying(true);
    
    try {
      const available = await checkApiStatus();
      
      if (available) {
        showToast('API connection restored!', 'success');
      } else {
        showToast('API is still unavailable', 'error');
      }
      
      return available;
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    const intervalId = setInterval(() => {
      if (!isApiAvailable) {
        checkApiStatus().then(available => {
          if (available && !isApiAvailable) {
            showToast('API connection restored!', 'success');
          }
        });
      } else {
        if (lastChecked && (new Date().getTime() - lastChecked.getTime() > 120000)) {
          checkApiStatus();
        }
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isApiAvailable, lastChecked]);

  return (
    <ApiStatusContext.Provider value={{ isApiAvailable, retryConnection, lastChecked }}>
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