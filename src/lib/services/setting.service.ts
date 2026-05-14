// File: src/lib/services/setting.service.ts
import axiosInstance from "../api/axios";
import { SettingsResponse, SettingValue } from "@/types/setting";

export const settingService = {
  // Lấy danh sách cài đặt theo mảng keys
  getSettings: async (keys: string[]): Promise<SettingsResponse> => {
    return axiosInstance.get("/admin/global-settings", {
      params: { keys: keys.join(",") },
    });
  },

  // Cập nhật từng key một
  updateSetting: async (
    key: string,
    value: SettingValue,
  ): Promise<{ success: boolean }> => {
    return axiosInstance.put("/admin/global-settings", { key, value });
  },

  // Helper cập nhật hàng loạt (nếu backend hỗ trợ hoặc gọi loop)
  updateMultipleSettings: async (settings: Record<string, SettingValue>) => {
    const promises = Object.entries(settings).map(([key, value]) =>
      axiosInstance.put("/admin/global-settings", { key, value }),
    );
    return Promise.all(promises);
  },
};
