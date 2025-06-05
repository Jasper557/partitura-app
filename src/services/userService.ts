import { api } from '../config/api';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications_enabled?: boolean;
}

/**
 * Get user's preferences from the API
 */
export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    const response = await api.get<UserPreferences>(`/users/${userId}/preferences`);
    return response.data;
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
  const response = await api.put<UserPreferences>(`/users/${userId}/preferences`, preferences);
  return response.data;
}; 