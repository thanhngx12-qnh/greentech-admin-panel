// File: src/types/news.ts
import { z } from "zod";

export type NewsStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "SCHEDULED";

// ==========================================
// 1. ZOD SCHEMAS (Validation cho Form)
// ==========================================
const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export const newsFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z
    .enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "SCHEDULED"])
    .default("DRAFT"),
  featured_image: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),

  // Tiếng Việt (Bắt buộc)
  title_vi: z.string().min(1, "Tiêu đề tiếng Việt là bắt buộc"),
  content_vi: z.string().min(1, "Nội dung tiếng Việt là bắt buộc"),
  slug_vi: z.string().min(1, "Đường dẫn SEO (Slug) là bắt buộc"),

  // Tiếng Anh (Tùy chọn)
  title_en: z.string().optional(),
  content_en: z.string().optional(),
  slug_en: z.string().optional(),

  // Tiếng Trung (Tùy chọn)
  title_zh: z.string().optional(),
  content_zh: z.string().optional(),
  slug_zh: z.string().optional(),

  // SEO Suite
  seo_i18n: z
    .object({
      vi: seoSchema.optional(),
      en: seoSchema.optional(),
      zh: seoSchema.optional(),
    })
    .optional(),
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
  seo_i18n?: {
    vi?: { meta_title?: string; meta_description?: string; og_image?: string };
    en?: { meta_title?: string; meta_description?: string; og_image?: string };
    zh?: { meta_title?: string; meta_description?: string; og_image?: string };
  };
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
