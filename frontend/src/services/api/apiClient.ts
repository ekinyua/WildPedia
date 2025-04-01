// src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://142.93.169.28:5000/";

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simplified API methods
export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(endpoint, config).then((response) => response.data),

  post: <T>(endpoint: string, data: any, config?: AxiosRequestConfig) =>
    axiosInstance
      .post<T>(endpoint, data, config)
      .then((response) => response.data),

  put: <T>(endpoint: string, data: any, config?: AxiosRequestConfig) =>
    axiosInstance
      .put<T>(endpoint, data, config)
      .then((response) => response.data),

  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(endpoint, config).then((response) => response.data),
};
