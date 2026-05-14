// File: src/types/setting.ts

// Loại giá trị cài đặt:
// 1. Simple: {"value": "0987..."}
// 2. I18n: {"vi": "...", "en": "...", "zh": "..."}
export interface SettingValue {
  value?: string;
  vi?: string;
  en?: string;
  zh?: string;
  [key: string]: any;
}

export interface GlobalSetting {
  key: string;
  value: SettingValue;
  updated_at?: string;
}

export interface SettingsResponse {
  success: boolean;
  data: Record<string, SettingValue>;
}

// Danh sách các Key dự kiến sử dụng trong hệ thống
export const SETTING_KEYS = [
  "company_name",
  "company_address",
  "contact_hotline",
  "contact_email",
  "contact_map_url",
  "site_logo",
  "site_favicon",
  "social_facebook",
  "social_linkedin",
  "social_zalo",
  "google_analytics_id",
  "header_scripts",
];
