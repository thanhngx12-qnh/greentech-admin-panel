// File: src/lib/services/service.service.ts
import axiosInstance from "../api/axios";
import {
  ServiceListResponse,
  ServiceFormInputs,
  ServiceStatus,
} from "@/types/service";

export const serviceService = {
  getServices: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    order?: string;
  }): Promise<ServiceListResponse> => {
    return axiosInstance.get("/admin/services", { params });
  },

  getServiceById: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosInstance.get(`/admin/services/${id}`);
  },

  createService: async (data: ServiceFormInputs) => {
    return axiosInstance.post("/admin/services", data);
  },

  updateService: async (id: string, data: Partial<ServiceFormInputs>) => {
    return axiosInstance.put(`/admin/services/${id}`, data);
  },

  deleteService: async (id: string) => {
    return axiosInstance.delete(`/admin/services/${id}`);
  },
};
