// src/services/api/learningApiClient.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";

// Learning service base URL (quiz API)
const LEARNING_API_URL = "http://localhost:3000";

// Create Axios instance with default config for learning service
const learningInstance: AxiosInstance = axios.create({
  baseURL: LEARNING_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout (longer for AI generation)
});

// Request interceptor to add auth token if needed
learningInstance.interceptors.request.use(
  (config) => {
    // Only add token for authenticated endpoints if needed
    if (config.url?.includes("/protected")) {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add cache-busting headers for quiz requests
    if (config.url?.includes("/quiz")) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers["Pragma"] = "no-cache";
      config.headers["Expires"] = "0";
      config.headers["X-Random"] = Math.random().toString();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for better error handling
learningInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Learning API Error:", error);
    if (!error.response) {
      console.error(
        "Network Error - Please check if the learning server is running"
      );
    } else {
      console.error(
        `Status: ${error.response.status}, Message: ${error.message}`
      );
      console.error("Error Config:", error.config);
    }
    return Promise.reject(error);
  }
);

// Simplified API methods that directly return the data
export const learningApi = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await learningInstance.get(
      endpoint,
      config
    );
    return response.data;
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    console.log(
      `Learning API: Making POST request to: ${LEARNING_API_URL}${endpoint}`
    );
    console.log("Request data:", data);
    const response: AxiosResponse<T> = await learningInstance.post(
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
    const response: AxiosResponse<T> = await learningInstance.put(
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
    const response: AxiosResponse<T> = await learningInstance.delete(
      endpoint,
      config
    );
    return response.data;
  },
};
