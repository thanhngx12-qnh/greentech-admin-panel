// File: src/lib/services/user.service.ts
import axiosInstance from "../api/axios";
import { UserListResponse, User, UserFormInputs } from "@/types/user";

export const userService = {
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<UserListResponse> => {
    return axiosInstance.get("/admin/users", { params });
  },

  getUserById: async (
    id: string,
  ): Promise<{ success: boolean; data: User }> => {
    return axiosInstance.get(`/admin/users/${id}`);
  },

  createUser: async (data: UserFormInputs) => {
    return axiosInstance.post("/admin/users", data);
  },

  updateUser: async (id: string, data: Partial<UserFormInputs>) => {
    return axiosInstance.put(`/admin/users/${id}`, data);
  },

  deleteUser: async (id: string) => {
    return axiosInstance.delete(`/admin/users/${id}`);
  },
};
