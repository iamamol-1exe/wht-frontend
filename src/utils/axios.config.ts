import { ApiError } from "@/types/apiTypes";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3010/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await publicApiClient.get("/auth/refresh-token");
        return apiClient(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Public API error:", error);
    return Promise.reject(error);
  }
);

export const handleApiError = (error: ApiError): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
