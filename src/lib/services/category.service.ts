// File: src/lib/services/category.service.ts
import axiosInstance from "../api/axios";
import {
  CategoryListResponse,
  CategoryResponse,
  CategoryFormInputs,
} from "@/types/category";

export const categoryService = {
  // Lấy danh sách (Có phân trang, search, filter)
  getCategories: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    order?: string;
  }): Promise<CategoryListResponse> => {
    // axiosInstance sẽ tự động gọi vào /api-backend/admin/categories
    // và Middleware sẽ proxy tới http://localhost:3000/admin/categories kèm HttpOnly Token
    return axiosInstance.get("/admin/categories", { params });
  },

  // Tạo mới
  createCategory: async (
    data: CategoryFormInputs,
  ): Promise<CategoryResponse> => {
    return axiosInstance.post("/admin/categories", data);
  },

  // Cập nhật
  updateCategory: async (
    id: number,
    data: Partial<CategoryFormInputs>,
  ): Promise<CategoryResponse> => {
    return axiosInstance.put(`/admin/categories/${id}`, data);
  },

  // Xóa (Soft Delete)
  deleteCategory: async (id: number): Promise<{ success: boolean }> => {
    return axiosInstance.delete(`/admin/categories/${id}`);
  },
};
