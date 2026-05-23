import axios from "axios";
import { exceptionHandler } from "../core";

export const axiosPublicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivateInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivateInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(await exceptionHandler(error.response));
  },
);

axiosPublicInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(await exceptionHandler(error.response));
  },
);
