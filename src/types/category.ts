// File: src/types/category.ts
import { z } from "zod";

// ==========================================
// 1. ZOD SCHEMAS (Validation cho Form)
// ==========================================

export const CategoryTypeEnum = z.enum(["NEWS", "SERVICE", "STANDARD", "JOB"]);

// Định dạng object đa ngôn ngữ cơ bản (Thêm zh)
export const i18nStringSchema = z.object({
  vi: z.string().min(1, "Tiếng Việt là bắt buộc"),
  en: z.string().optional(),
  zh: z.string().optional(),
});

// Định dạng object đa ngôn ngữ không bắt buộc (Thêm zh)
export const i18nOptionalStringSchema = z.object({
  vi: z.string().optional(),
  en: z.string().optional(),
  zh: z.string().optional(),
});

export const categoryFormSchema = z.object({
  slug: z.string().min(1, "Vui lòng nhập đường dẫn SEO (slug)"),
  type: CategoryTypeEnum,
  name_i18n: i18nStringSchema,
  desc_i18n: i18nOptionalStringSchema.optional(),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

// ==========================================
// 2. INTERFACES (Cấu trúc dữ liệu trả về)
// ==========================================

export interface I18nRecord {
  vi: string;
  en?: string;
  zh?: string;
  [key: string]: string | undefined;
}

export interface Category {
  id: number;
  slug: string;
  type: "NEWS" | "SERVICE" | "STANDARD" | "JOB";
  name_i18n: I18nRecord;
  desc_i18n?: I18nRecord;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
  meta: PaginationMeta;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}
