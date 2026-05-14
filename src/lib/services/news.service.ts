// File: src/lib/services/news.service.ts
import axiosInstance from "../api/axios";
import {
  NewsListResponse,
  NewsDetailResponse,
  NewsFormInputs,
} from "@/types/news";

export const newsService = {
  // 1. Lấy danh sách có phân trang
  getNewsList: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<NewsListResponse> => {
    return axiosInstance.get("/admin/news", { params });
  },

  // 2. Lấy chi tiết 1 bài viết để đổ vào Form Edit
  getNewsById: async (id: string): Promise<NewsDetailResponse> => {
    return axiosInstance.get(`/admin/news/${id}`);
  },

  // 3. Tạo mới bài viết
  createNews: async (data: NewsFormInputs): Promise<NewsDetailResponse> => {
    return axiosInstance.post("/admin/news", data);
  },

  // 4. Cập nhật bài viết
  updateNews: async (
    id: string,
    data: Partial<NewsFormInputs>,
  ): Promise<NewsDetailResponse> => {
    return axiosInstance.put(`/admin/news/${id}`, data);
  },

  // 5. Xóa bài viết
  deleteNews: async (id: string): Promise<{ success: boolean }> => {
    return axiosInstance.delete(`/admin/news/${id}`);
  },
};
