// File: src/lib/services/slider.service.ts
import axiosInstance from "../api/axios";
import {
  SliderListResponse,
  SliderFormInputs,
  SliderAdmin,
} from "@/types/slider";

export const sliderService = {
  getSliders: async (params: {
    page?: number;
    limit?: number;
    position?: string;
    status?: string;
  }): Promise<SliderListResponse> => {
    return axiosInstance.get("/admin/sliders", { params });
  },

  getSliderById: async (
    id: number,
  ): Promise<{ success: boolean; data: SliderAdmin }> => {
    return axiosInstance.get(`/admin/sliders/${id}`);
  },

  createSlider: async (data: SliderFormInputs) => {
    return axiosInstance.post("/admin/sliders", data);
  },

  updateSlider: async (id: number, data: Partial<SliderFormInputs>) => {
    return axiosInstance.put(`/admin/sliders/${id}`, data);
  },

  deleteSlider: async (id: number) => {
    return axiosInstance.delete(`/admin/sliders/${id}`);
  },
};
