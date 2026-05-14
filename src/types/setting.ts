// File: src/types/setting.ts

export interface SettingValue {
  value?: string;
  vi?: string;
  en?: string;
  zh?: string;
  [key: string]: any;
}

export const SETTING_KEYS = [
  // 1. THƯƠNG HIỆU & NHẬN DIỆN
  "site_name", // Tên website (i18n)
  "site_slogan", // Câu slogan (i18n)
  "site_logo_header", // Logo thanh điều hướng
  "site_logo_footer", // Logo dưới chân trang
  "site_favicon", // Icon trình duyệt

  // 2. THÔNG TIN DOANH NGHIỆP & LIÊN HỆ
  "company_full_name", // Tên đầy đủ pháp nhân (i18n)
  "company_tax_code", // Mã số thuế
  "company_address", // Địa chỉ (i18n)
  "contact_hotline", // Hotline kinh doanh
  "contact_phone", // Điện thoại văn phòng
  "contact_email", // Email nhận lead
  "contact_map_embed", // Mã nhúng Google Map
  "working_hours", // Giờ làm việc (i18n)

  // 3. SEO MẶC ĐỊNH (FALLBACK SEO)
  "seo_default_title", // Tiêu đề mặc định (i18n)
  "seo_default_description", // Mô tả mặc định (i18n)
  "seo_default_keywords", // Từ khóa mặc định (i18n)
  "seo_default_og_image", // Ảnh chia sẻ mặc định

  // 4. MẠNG XÃ HỘI (SOCIAL LINKS)
  "social_facebook",
  "social_linkedin",
  "social_youtube",
  "social_zalo_oa",
  "social_tiktok",

  // 5. KỸ THUẬT & TÍCH HỢP
  "google_analytics_id",
  "google_search_console_id", // Mã xác minh (meta tag)
  "facebook_pixel_id",
  "google_indexing_json", // JSON xác thực Indexing API
  "header_scripts", // Scripts chèn đầu trang
  "footer_scripts", // Scripts chèn cuối trang
  "copyright_text", // Dòng bản quyền chân trang (i18n)
];
