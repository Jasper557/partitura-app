import { apiRequest } from '../config/api';
import { supabase } from '../config/supabase';

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
    console.error('Error fetching user preferences:', error);
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
  try {
    return await apiRequest<UserPreferences>(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Get the current authentication token
 * Used to send with API requests
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Error getting auth token:', error);
      return null;
    }
    
    return data.session.access_token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}; 