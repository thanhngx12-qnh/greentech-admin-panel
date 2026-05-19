// File: src/types/service.ts
import { z } from "zod";

export type ServiceStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

// Làm sạch schema: Bỏ coerce, bỏ default, dùng catch để ép kiểu an toàn
export const serviceFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]),
  featured_image: z.string().catch(""),

  // Dữ liệu thương mại: RHFInputNumber đã trả về number rồi nên chỉ cần z.number()
  // Dùng catch(0) để nếu người dùng xóa trắng ô input thì mặc định là 0
  price: z.number().catch(0),
  currency: z.string().catch("VND"),
  duration: z.string().catch(""),

  // Đa ngôn ngữ (vi, en, zh)
  title_vi: z.string().min(1, "Tên dịch vụ (VI) là bắt buộc"),
  content_vi: z.string().min(1, "Nội dung (VI) là bắt buộc"),
  slug_vi: z.string().min(1, "Slug (VI) là bắt buộc"),

  title_en: z.string().catch(""),
  content_en: z.string().catch(""),
  slug_en: z.string().catch(""),

  title_zh: z.string().catch(""),
  content_zh: z.string().catch(""),
  slug_zh: z.string().catch(""),

  seo_i18n: z.any().optional(),
});

// TypeScript giờ đây sẽ nội suy chính xác 100% mà không bị unknown
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
