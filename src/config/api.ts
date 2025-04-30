// API configuration and helper functions
import { getAuthToken } from '../services/userService';

/**
 * Base API URL from environment variables
 * Defaults to localhost:3001 in development
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Helper function to handle API response errors
 */
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = 
      errorData?.error || 
      errorData?.message || 
      `API Error: ${response.status} ${response.statusText}`;
    
    throw new Error(errorMessage);
  }
  
  return response;
};

/**
 * Helper function to get authorization headers with token
 */
export const getAuthHeaders = async (customHeaders: HeadersInit = {}) => {
  const token = await getAuthToken();
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

/**
 * Helper function to make API requests with consistent error handling
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers = await getAuthHeaders(options.headers);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    await handleApiError(response);
    
    // Return null for 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Helper function for file uploads
 */
export const uploadFile = async <T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = await getAuthToken();
    
    // For file uploads, don't set Content-Type - let the browser set it with boundary
    const headers = {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options,
      headers,
    });
    
    await handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}; 