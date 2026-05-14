// File: src/lib/services/standard.service.ts
import axiosInstance from "../api/axios";
import { StandardListResponse, StandardFormInputs } from "@/types/standard";

export const standardService = {
  getStandards: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    sortBy?: string;
    order?: string;
  }): Promise<StandardListResponse> => {
    return axiosInstance.get("/admin/standards", { params });
  },

  getStandardById: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosInstance.get(`/admin/standards/${id}`);
  },

  createStandard: async (data: StandardFormInputs) => {
    return axiosInstance.post("/admin/standards", data);
  },

  updateStandard: async (id: string, data: Partial<StandardFormInputs>) => {
    return axiosInstance.put(`/admin/standards/${id}`, data);
  },

  deleteStandard: async (id: string) => {
    return axiosInstance.delete(`/admin/standards/${id}`);
  },
};
