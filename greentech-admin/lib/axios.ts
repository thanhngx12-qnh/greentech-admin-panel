/* File: lib/axios.ts */
import axios from "axios";

const axiosClient = axios.create({
  // Sử dụng path proxy đã cấu hình ở next.config.mjs
  baseURL: "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
