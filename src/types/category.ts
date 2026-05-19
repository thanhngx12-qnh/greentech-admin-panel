// File: src/types/category.ts
import { z } from "zod";

export const CategoryTypeEnum = z.enum(["NEWS", "SERVICE", "STANDARD", "JOB"]);

// Định nghĩa schema thuần túy, không dùng coerce hay catch để Zod tự suy luận chuẩn 100%
export const categoryFormSchema = z.object({
  slug: z.string().min(1, "Vui lòng nhập đường dẫn SEO (slug)"),
  type: CategoryTypeEnum,
  name_i18n: z.object({
    vi: z.string().min(1, "Tiếng Việt là bắt buộc"),
    en: z.string().optional(),
    zh: z.string().optional(),
  }),
  desc_i18n: z
    .object({
      vi: z.string().optional(),
      en: z.string().optional(),
      zh: z.string().optional(),
    })
    .optional(),
  order: z.number(), // Chỉ cần z.number() thuần túy
  is_active: z.boolean(),
});

// Zod tự động tạo Type hoàn chỉnh, không có unknown
export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

// ==========================================
// INTERFACES CHO API (Giữ nguyên)
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
