// API configuration and helper functions
import { getAuthToken } from '../services/userService';

/**
 * Base API URL from environment variables
 * Uses localhost in development mode
 * Uses production URL in production build
 */
export const API_URL = import.meta.env.PROD 
  ? 'https://partitura-api.onrender.com' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

/**
 * Helper function to build a complete API URL, ensuring no duplicate /api segments
 */
export const buildApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Check if endpoint already starts with /api
  if (normalizedEndpoint.startsWith('/api/')) {
    return `${API_URL}${normalizedEndpoint}`;
  }
  
  // Otherwise, add the /api prefix
  return `${API_URL}/api${normalizedEndpoint}`;
}

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
    let errorData: any = null;
    
    try {
      errorData = await response.json();
    } catch (parseError) {
      // If the response isn't valid JSON, create a basic error object
      errorData = { error: `API Error: ${response.status} ${response.statusText}` };
    }
    
    const errorMessage = 
      errorData?.error || 
      errorData?.message || 
      `API Error: ${response.status} ${response.statusText}`;
    
    // Handle authentication errors specially
    if (response.status === 401 || response.status === 403) {
      // Token expired, attempt to refresh the session through Supabase
      try {
        const { supabase } = await import('../config/supabase');
        const { data, error } = await supabase.auth.refreshSession();
        
        // If the refresh was successful, return so the original request can be retried
        if (data?.session && !error) {
          console.log('Successfully refreshed auth token');
          // Don't throw the error if refresh succeeded, allowing the request to be retried
          return 'retry';
        } else {
          console.error('Failed to refresh token:', error);
          // If token can't be refreshed, user will need to re-authenticate
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Force redirect to login on critical auth errors
        window.location.href = '/login';
      }
    }
    
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
  options: RequestInit = {},
  retryCount: number = 0
): Promise<T> => {
  try {
    const url = buildApiUrl(endpoint);
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
    
    // Handle 401 errors separately with retry logic
    if (response.status === 401 && retryCount < 1) {
      // Force token refresh
      try {
        const { supabase } = await import('../config/supabase');
        const { error } = await supabase.auth.refreshSession();
        
        if (!error) {
          // Retry the request with a fresh token
          return await apiRequest(endpoint, options, retryCount + 1);
        }
      } catch (refreshError) {
        // Ignore refresh errors
      }
    }
    
    await handleApiError(response);
    
    // Return null for 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }
    
    return await response.json();
  } catch (error: any) {
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
    const url = buildApiUrl(endpoint);
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