// src/services/api/authApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Auth service base URL
const AUTH_API_URL = "http://localhost:5000/api";

// Create Axios instance with default config for auth service
const authInstance: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor to add auth token
authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for better error handling
authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Auth API Error:", error);
    // Check if error is due to network issues
    if (!error.response) {
      console.error("Network Error - Please check your connection");
    }
    // Log status code and error message for debugging
    else {
      console.error(
        `Status: ${error.response.status}, Message: ${error.message}`
      );
      console.error("Error Config:", error.config);
    }
    return Promise.reject(error);
  }
);

// Simplified API methods that directly return the data
export const authApi = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await authInstance.get(endpoint, config);
    return response.data;
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    console.log(`Auth API: Making POST request to: ${AUTH_API_URL}${endpoint}`);
    console.log("Request data:", data);
    const response: AxiosResponse<T> = await authInstance.post(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  put: async <T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await authInstance.put(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  delete: async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await authInstance.delete(
      endpoint,
      config
    );
    return response.data;
  },
};
