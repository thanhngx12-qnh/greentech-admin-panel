// File: src/lib/services/profile.service.ts
import axiosInstance from "../api/axios";
import {
  UserProfile,
  ProfileUpdateInputs,
  ChangePasswordInputs,
} from "@/types/profile";

export const profileService = {
  // Lấy thông tin cá nhân
  getMe: async (): Promise<{ success: boolean; data: UserProfile }> => {
    return axiosInstance.get("/admin/profile/me");
  },

  // Cập nhật họ tên
  updateMe: async (
    data: ProfileUpdateInputs,
  ): Promise<{ success: boolean }> => {
    return axiosInstance.put("/admin/profile/me", data);
  },

  // Đổi mật khẩu
  changePassword: async (
    data: ChangePasswordInputs,
  ): Promise<{ success: boolean }> => {
    return axiosInstance.put("/admin/profile/change-password", data);
  },
};
