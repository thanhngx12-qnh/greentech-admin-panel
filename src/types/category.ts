// File: src/types/category.ts
import { z } from "zod";

export const CategoryTypeEnum = z.enum(["NEWS", "SERVICE", "STANDARD", "JOB"]);

// Định nghĩa Schema con cho đa ngôn ngữ, đảm bảo luôn trả về string (dù là rỗng)
const i18nSchema = z.object({
  vi: z.string().min(1, "Tiếng Việt là bắt buộc"),
  en: z.string().catch(""), // Dùng catch thay cho default/optional để ép kiểu string chắc chắn
  zh: z.string().catch(""),
});

const i18nOptionalSchema = z.object({
  vi: z.string().catch(""),
  en: z.string().catch(""),
  zh: z.string().catch(""),
});

export const categoryFormSchema = z.object({
  slug: z.string().min(1, "Vui lòng nhập đường dẫn SEO (slug)"),
  type: CategoryTypeEnum,
  name_i18n: i18nSchema,
  desc_i18n: i18nOptionalSchema,
  order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

// Ép kiểu chuẩn để React Hook Form nhận diện đúng bộ Keys
export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

// --- INTERFACES CHO DỮ LIỆU API (Giữ nguyên) ---
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
