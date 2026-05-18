// File: src/lib/services/setting.service.ts
import axiosInstance from "../api/axios";
import { SettingsResponse, SettingValue } from "@/types/setting";

export const settingService = {
  // 1. Lấy danh sách cài đặt
  getSettings: async (keys: string[]): Promise<SettingsResponse> => {
    return axiosInstance.get("/admin/global-settings", {
      params: { keys: keys.join(",") },
    });
  },

  // 2. Cập nhật HÀNG LOẠT (API v2.0 - Tối ưu)
  updateBulkSettings: async (
    settings: { key: string; value: SettingValue }[],
  ): Promise<{ success: boolean }> => {
    return axiosInstance.put("/admin/global-settings/bulk", { settings });
  },

  // 3. Cập nhật đơn lẻ (Giữ lại cho các trường hợp đặc biệt nếu cần)
  updateSetting: async (
    key: string,
    value: SettingValue,
  ): Promise<{ success: boolean }> => {
    return axiosInstance.put("/admin/global-settings", { key, value });
  },
};
