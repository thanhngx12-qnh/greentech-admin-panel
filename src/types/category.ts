// File: src/types/category.ts
import { z } from "zod";

// ==========================================
// 1. ZOD SCHEMAS (Validation cho Form)
// ==========================================

export const CategoryTypeEnum = z.enum(["NEWS", "SERVICE", "STANDARD", "JOB"]);

export const i18nStringSchema = z.object({
  vi: z.string().min(1, "Tiếng Việt là bắt buộc"),
  en: z.string().optional().nullable(),
  zh: z.string().optional().nullable(),
});

export const i18nOptionalStringSchema = z.object({
  vi: z.string().optional().nullable(),
  en: z.string().optional().nullable(),
  zh: z.string().optional().nullable(),
});

export const categoryFormSchema = z.object({
  slug: z.string().min(1, "Vui lòng nhập đường dẫn SEO (slug)"),
  type: CategoryTypeEnum,
  name_i18n: i18nStringSchema,
  desc_i18n: i18nOptionalStringSchema.optional(),
  // Sử dụng coerce để đảm bảo luôn là number và mặc định là 0
  order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// Chỉnh sửa Type Inference để đảm bảo không bị dính 'undefined' vào các trường có default
export type CategoryFormInputs = z.input<typeof categoryFormSchema> & {
  order: number;
  is_active: boolean;
};
// ==========================================
// 2. INTERFACES (Dữ liệu API)
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
