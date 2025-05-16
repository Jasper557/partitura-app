import { apiRequest } from '../config/api';
import { supabase } from '../config/supabase';
import { buildApiUrl } from '../config/api';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications_enabled?: boolean;
}

/**
 * Get user's preferences from the API
 */
export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    return await apiRequest<UserPreferences>(`/users/${userId}/preferences`);
  } catch (error) {
    // Return defaults if API fails
    return { theme: 'dark', notifications_enabled: true };
  }
};

/**
 * Update user preferences via the API
 */
export const updateUserPreferences = async (
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>(`/users/${userId}/preferences`, {
    method: 'PUT',
    body: JSON.stringify(preferences)
  });
};

/**
 * Get the current authentication token
 * Used to send with API requests
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    // Get from local storage directly
    const storageKey = 'partitura-auth';
    const jsonStr = localStorage.getItem(storageKey);
    
    if (!jsonStr) return null;
    
    try {
      const data = JSON.parse(jsonStr);
      if (!data?.access_token) return null;
      
      // Check if the token is expired
      if (data.expires_at && Date.now() < data.expires_at) {
        return data.access_token;
      } 
      
      // Token is expired, try to refresh
      if (data.refresh_token) {
        try {
          const response = await fetch(buildApiUrl('/auth/refresh'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: data.refresh_token })
          });
          
          if (response.ok) {
            const refreshData = await response.json();
            if (refreshData?.session?.access_token) {
              // Update the session with the new token
              data.access_token = refreshData.session.access_token;
              data.expires_at = Date.now() + (3600 * 1000); // 1 hour
              localStorage.setItem(storageKey, JSON.stringify(data));
              return data.access_token;
            }
          }
        } catch (refreshError) {
          // If refresh fails, continue with the expired token and let API handle it
        }
      }
      
      // Return the potentially expired token and let the API handle 401 errors
      return data.access_token;
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    return null;
  }
}; 