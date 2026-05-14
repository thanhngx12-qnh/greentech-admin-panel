// File: src/lib/services/auth.service.ts
import axiosInstance from "../api/axios";
import { LoginInputs, LoginResponse } from "@/types/auth";

export const authService = {
  login: async (data: LoginInputs): Promise<LoginResponse> => {
    return axiosInstance.post("/api/auth/login", data, {
      baseURL: "",
    });
  },

  // Thêm hàm logout
  logout: async () => {
    return axiosInstance.post(
      "/api/auth/logout",
      {},
      {
        baseURL: "",
      },
    );
  },
};
