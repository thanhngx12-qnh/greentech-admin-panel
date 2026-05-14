// File: src/types/career.ts
import { z } from "zod";

// Enums theo API Docs & Schema
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

// ==========================================
// 1. JOB POSTINGS SCHEMAS
// ==========================================
const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().url().optional().or(z.literal("")),
});

export const jobFormSchema = z.object({
  category_id: z.number({ required_error: "Vui lòng chọn danh mục" }),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]).default("DRAFT"),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"])
    .default("FULL_TIME"),
  location: z.string().min(1, "Địa điểm làm việc là bắt buộc"),
  salary_range: z.string().optional(),
  deadline: z.string().optional().or(z.literal("")),

  // Nội dung đa ngôn ngữ
  title_vi: z.string().min(1, "Tiêu đề (VI) là bắt buộc"),
  description_vi: z.string().min(1, "Mô tả (VI) là bắt buộc"),
  slug_vi: z.string().min(1, "Slug (VI) là bắt buộc"),

  title_en: z.string().optional(),
  description_en: z.string().optional(),
  slug_en: z.string().optional(),

  title_zh: z.string().optional(),
  description_zh: z.string().optional(),
  slug_zh: z.string().optional(),

  seo_i18n: z
    .object({
      vi: seoSchema.optional(),
      en: seoSchema.optional(),
      zh: seoSchema.optional(),
    })
    .optional(),
});

export type JobFormInputs = z.infer<typeof jobFormSchema>;

export interface JobPosting {
  id: string;
  title_i18n: { vi: string; en?: string; zh?: string };
  type: JobType;
  status: JobStatus;
  location: string;
  created_at: string;
}

// ==========================================
// 2. JOB APPLICATIONS INTERFACES
// ==========================================
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
