// API configuration and helper functions
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createAuthInterceptor, handleAuthError } from '../services/authService';

// Add type declaration for Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

/**
 * Determine if we're running in Tauri
 */
const isTauri = !!window.__TAURI__;

/**
 * Base API URL for backward compatibility
 */
export const API_URL = isTauri 
  ? 'http://localhost:3001' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

/**
 * Build API URL with proper base URL handling
 */
export const buildApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_URL}/api${normalizedPath}`;
};

/**
 * Error class for API-specific errors
 */
export class ApiError extends Error {
  status: number;
  isConnectionError: boolean;
  response?: any;

  constructor(message: string, status: number = 0, isConnectionError: boolean = false, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isConnectionError = isConnectionError;
    this.response = response;
  }
}

/**
 * Create configured axios instance with auth interceptors
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 15000, // 15 seconds
    // Don't set default Content-Type - let each request decide
    withCredentials: true,
  });

  // Add auth interceptor for automatic token management
  createAuthInterceptor(client);

  // Add response interceptor for enhanced error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle network errors
      if (!error.response) {
        throw new ApiError(
          'Unable to connect to the Partitura API. Please check your connection.',
          0,
          true
        );
      }

      const { status, statusText, data } = error.response;
      
      // Extract error message
      const errorMessage = data?.error || data?.message || `API Error: ${status} ${statusText}`;
      
      // Handle authentication errors
      if (status === 401 || status === 403) {
        const handled = await handleAuthError(status);
        if (!handled) {
          // If auth error couldn't be handled, redirect to login
          console.warn('Authentication failed, redirecting to login');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }

      // Throw enhanced error
      throw new ApiError(errorMessage, status, false, error.response);
    }
  );

  return client;
};

/**
 * Main API client instance
 */
export const apiClient = createApiClient();

/**
 * Convenience methods for different HTTP verbs with full URL construction
 */
export const api = {
  get: <T = any>(path: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(buildApiUrl(path), config),
  
  post: <T = any>(path: string, data?: any, config?: AxiosRequestConfig) => {
    // Set Content-Type for JSON requests, unless already specified
    const jsonConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      }
    };
    return apiClient.post<T>(buildApiUrl(path), data, jsonConfig);
  },
  
  put: <T = any>(path: string, data?: any, config?: AxiosRequestConfig) => {
    // Set Content-Type for JSON requests, unless already specified  
    const jsonConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      }
    };
    return apiClient.put<T>(buildApiUrl(path), data, jsonConfig);
  },
  
  patch: <T = any>(path: string, data?: any, config?: AxiosRequestConfig) => {
    // Set Content-Type for JSON requests, unless already specified
    const jsonConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      }
    };
    return apiClient.patch<T>(buildApiUrl(path), data, jsonConfig);
  },
  
  delete: <T = any>(path: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(buildApiUrl(path), config),
};

/**
 * Helper function for file uploads
 */
export const uploadFile = async <T = any>(
  path: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const uploadConfig = {
    ...config,
    headers: {
      // Remove Content-Type to let axios set multipart/form-data boundary automatically
      ...config?.headers,
    },
    timeout: 30000, // 30 seconds for file uploads
  };

  // Explicitly remove Content-Type if it exists to ensure multipart boundary is set correctly
  if (uploadConfig.headers && 'Content-Type' in uploadConfig.headers) {
    delete uploadConfig.headers['Content-Type'];
  }

  console.log('Uploading file to:', buildApiUrl(path));
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
  }

  const response = await apiClient.post<T>(buildApiUrl(path), formData, uploadConfig);
  return response.data;
};

/**
 * Helper function to check API health
 * Falls back to a simple connection test if /health endpoint doesn't exist
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    // Health endpoint is at /health, not /api/health
    const healthUrl = `${API_URL}/health`;
    const response = await apiClient.get(healthUrl, { 
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accept any status under 500 as "healthy"
    });
    return true;
  } catch (error: any) {
    // If it's a 404, the health endpoint doesn't exist - that's ok, API might still be working
    if (error.status === 404) {
      try {
        // Try a simple request to test basic connectivity
        // This will test if the server is running and auth interceptors work
        const response = await apiClient.get(buildApiUrl('/'), { 
          timeout: 5000,
          validateStatus: (status) => status < 500 // Accept any status under 500 as "healthy"
        });
        return true;
      } catch (connectError) {
        // If this also fails, the API is likely down
        return false;
      }
    }
    
    // For other errors (network, 500, etc.), consider API unhealthy
    console.warn('API health check failed:', error.message || error);
    return false;
  }
};

// Export the main client as default
export default apiClient; 