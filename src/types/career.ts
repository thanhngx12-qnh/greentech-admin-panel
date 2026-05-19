// File: src/types/career.ts
import { z } from "zod";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "CONTRACT"
  | "FREELANCE";
export type JobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type ApplicationStatus =
  | "NEW"
  | "REVIEWING"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

// 1. Tạo Schema hoàn toàn thuần túy, không dùng .default() hay ép kiểu z.ZodType
export const jobFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
  type: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "INTERNSHIP",
    "CONTRACT",
    "FREELANCE",
  ]),
  location: z.string().min(1, "Địa điểm làm việc là bắt buộc"),
  salary_range: z.string().optional(),
  deadline: z.string().optional().nullable(), // Cho phép trống

  title_vi: z.string().min(1, "Tiêu đề (VI) là bắt buộc"),
  description_vi: z.string().min(1, "Mô tả (VI) là bắt buộc"),
  slug_vi: z.string().min(1, "Slug (VI) là bắt buộc"),

  title_en: z.string().optional(),
  description_en: z.string().optional(),
  slug_en: z.string().optional(),

  title_zh: z.string().optional(),
  description_zh: z.string().optional(),
  slug_zh: z.string().optional(),

  seo_i18n: z.any().optional(),
});

// 2. Để Zod tự động suy luận Type, đảm bảo khớp 100% với react-hook-form
export type JobFormInputs = z.infer<typeof jobFormSchema>;

// ==========================================
// 3. INTERFACES CHO API (Giữ nguyên)
// ==========================================
export interface JobPosting {
  id: string;
  title_i18n: { vi: string; en?: string; zh?: string };
  type: JobType;
  status: JobStatus;
  location: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  status: ApplicationStatus;
  job?: { title_i18n: { vi: string } };
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
