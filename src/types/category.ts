// File: src/types/category.ts
import { z } from "zod";

export const CategoryTypeEnum = z.enum(["NEWS", "SERVICE", "STANDARD", "JOB"]);

// Định nghĩa Schema cho i18n ổn định hơn cho Form
const i18nSchema = z.object({
  vi: z.string().min(1, "Tiếng Việt là bắt buộc"),
  en: z.string().optional().default(""),
  zh: z.string().optional().default(""),
});

const i18nOptionalSchema = z.object({
  vi: z.string().optional().default(""),
  en: z.string().optional().default(""),
  zh: z.string().optional().default(""),
});

export const categoryFormSchema = z.object({
  slug: z.string().min(1, "Vui lòng nhập đường dẫn SEO (slug)"),
  type: CategoryTypeEnum,
  name_i18n: i18nSchema,
  desc_i18n: i18nOptionalSchema,
  // Dùng coerce để đảm bảo input từ form luôn là number
  order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

// FIX: Chỉ sử dụng z.infer để TypeScript lấy đúng bộ Keys (String Literals)
export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

// --- INTERFACES CHO API (Giữ nguyên để map dữ liệu) ---
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
