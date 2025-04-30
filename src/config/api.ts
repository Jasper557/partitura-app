// API configuration and helper functions
import { getAuthToken } from '../services/userService';

/**
 * Base API URL from environment variables
 * Defaults to localhost:3001 in development
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Error class for API-specific errors
 */
export class ApiError extends Error {
  status: number;
  isConnectionError: boolean;

  constructor(message: string, status: number = 0, isConnectionError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isConnectionError = isConnectionError;
  }
}

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
    
    throw new ApiError(errorMessage, response.status);
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
    
    // Set a timeout to detect unavailable API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    await handleApiError(response);
    
    // Return null for 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('API request failed:', error);
    
    // Handle network errors and timeouts
    if (
      error.name === 'AbortError' || 
      error.name === 'TypeError' || 
      error.message === 'Failed to fetch'
    ) {
      throw new ApiError(
        'Unable to connect to the Partitura API.',
        0,
        true
      );
    }
    
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
    
    // Set a timeout to detect unavailable API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    await handleApiError(response);
    return await response.json();
  } catch (error: any) {
    console.error('File upload failed:', error);
    
    // Handle network errors and timeouts
    if (
      error.name === 'AbortError' || 
      error.name === 'TypeError' || 
      error.message === 'Failed to fetch'
    ) {
      throw new ApiError(
        'Unable to connect to the Partitura API.',
        0,
        true
      );
    }
    
    throw error;
  }
}; 