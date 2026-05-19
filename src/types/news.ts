// File: src/types/news.ts
import { z } from "zod";

export type NewsStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "SCHEDULED";

// 1. ZOD SCHEMA THUẦN TÚY (Không dùng .default)
export const newsFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "SCHEDULED"]),
  featured_image: z.string().catch(""), // Dùng catch("") để ép kiểu string chắc chắn

  title_vi: z.string().min(1, "Tiêu đề tiếng Việt là bắt buộc"),
  content_vi: z.string().min(1, "Nội dung tiếng Việt là bắt buộc"),
  slug_vi: z.string().min(1, "Đường dẫn SEO (Slug) là bắt buộc"),

  title_en: z.string().catch(""),
  content_en: z.string().catch(""),
  slug_en: z.string().catch(""),

  title_zh: z.string().catch(""),
  content_zh: z.string().catch(""),
  slug_zh: z.string().catch(""),

  is_index_request: z.boolean(), // Trường cho Google Indexing
  seo_i18n: z.any().optional(),
});

export type NewsFormInputs = z.infer<typeof newsFormSchema>;

// ==========================================
// 2. INTERFACES (Cấu trúc dữ liệu trả về)
// ==========================================
export interface NewsAdmin {
  id: string;
  title_i18n: { vi: string; en?: string; zh?: string };
  status: NewsStatus;
  author?: { full_name: string };
  created_at: string;
}

export interface NewsDetail extends NewsAdmin {
  category_id: number;
  featured_image?: string;
  slug_i18n: { vi: string; en?: string; zh?: string };
  content_i18n: { vi: string; en?: string; zh?: string };
  seo_i18n?: any;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NewsListResponse {
  success: boolean;
  data: NewsAdmin[];
  meta: PaginationMeta;
}

export interface NewsDetailResponse {
  success: boolean;
  data: NewsDetail;
}
