// File: src/types/standard.ts
import { z } from "zod";

const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
});

export const standardFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  code: z.string().min(1, "Mã tiêu chuẩn/quy chuẩn là bắt buộc"),
  file_url: z
    .string()
    .url("Link tài liệu không hợp lệ")
    .optional()
    .or(z.literal("")),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),

  // Đa ngôn ngữ
  title_vi: z.string().min(1, "Tên tiêu chuẩn (VI) là bắt buộc"),
  content_vi: z.string().optional(), // Nội dung tóm tắt
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

export type StandardFormInputs = z.infer<typeof standardFormSchema>;

export interface StandardAdmin {
  id: string;
  code: string;
  title_i18n: { vi: string; en?: string; zh?: string };
  category?: { name_i18n: { vi: string }; id: number };
  file_url?: string;
  status: string;
  created_at: string;
}

export interface StandardListResponse {
  success: boolean;
  data: StandardAdmin[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
