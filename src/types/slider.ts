// File: src/types/slider.ts
import { z } from "zod";

export type SliderPosition =
  | "HOME_TOP"
  | "HOME_MIDDLE"
  | "SERVICES_TOP"
  | "NEWS_TOP"
  | "CONTACT_TOP";

export const sliderFormSchema = z.object({
  name: z.string().min(1, "Tên định danh nội bộ là bắt buộc"),
  position: z.enum([
    "HOME_TOP",
    "HOME_MIDDLE",
    "SERVICES_TOP",
    "NEWS_TOP",
    "CONTACT_TOP",
  ]),
  order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),

  // Tiếng Việt
  image_desktop_vi: z
    .string()
    .url("Link ảnh không hợp lệ")
    .min(1, "Ảnh Desktop (VI) là bắt buộc"),
  image_mobile_vi: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  title_vi: z.string().optional(),
  subtitle_vi: z.string().optional(),
  link_url_vi: z.string().url("Link không hợp lệ").optional().or(z.literal("")),

  // Tiếng Anh
  image_desktop_en: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  image_mobile_en: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  title_en: z.string().optional(),
  subtitle_en: z.string().optional(),
  link_url_en: z.string().url("Link không hợp lệ").optional().or(z.literal("")),

  // Tiếng Trung
  image_desktop_zh: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  image_mobile_zh: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  title_zh: z.string().optional(),
  subtitle_zh: z.string().optional(),
  link_url_zh: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
});

export type SliderFormInputs = z.infer<typeof sliderFormSchema>;

export interface SliderAdmin {
  id: number;
  name: string;
  position: SliderPosition;
  content_i18n: any;
  is_active: boolean;
  order: number;
  created_at: string;
}
