// File: src/types/service.ts
import { z } from "zod";

export type ServiceStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
});

export const serviceFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  featured_image: z
    .string()
    .url("Link không hợp lệ")
    .optional()
    .or(z.literal("")),

  // Dữ liệu thương mại
  price: z.number().min(0, "Giá không được âm").optional().or(z.literal(0)),
  currency: z.string().default("VND"),
  duration: z.string().optional(),

  // Đa ngôn ngữ (vi, en, zh)
  title_vi: z.string().min(1, "Tên dịch vụ (VI) là bắt buộc"),
  content_vi: z.string().min(1, "Nội dung (VI) là bắt buộc"),
  slug_vi: z.string().min(1, "Slug (VI) là bắt buộc"),

  title_en: z.string().optional(),
  content_en: z.string().optional(),
  slug_en: z.string().optional(),

  title_zh: z.string().optional(),
  content_zh: z.string().optional(),
  slug_zh: z.string().optional(),

  seo_i18n: z
    .object({
      vi: seoSchema.optional(),
      en: seoSchema.optional(),
      zh: seoSchema.optional(),
    })
    .optional(),
});

export type ServiceFormInputs = z.infer<typeof serviceFormSchema>;

export interface ServiceAdmin {
  id: string;
  title_i18n: { vi: string; en?: string; zh?: string };
  price?: number;
  currency?: string;
  status: ServiceStatus;
  author?: { full_name: string };
  created_at: string;
}

export interface ServiceDetail extends ServiceAdmin {
  category_id: number;
  featured_image?: string;
  duration?: string;
  slug_i18n: { vi: string; en?: string; zh?: string };
  content_i18n: { vi: string; en?: string; zh?: string };
  seo_i18n?: any;
}

export interface ServiceListResponse {
  success: boolean;
  data: ServiceAdmin[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
