// File: src/types/profile.ts
import { z } from "zod";

// 1. Schema cập nhật thông tin
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Họ và tên không được để trống"),
});

export type ProfileUpdateInputs = z.infer<typeof profileUpdateSchema>;

// 2. Schema đổi mật khẩu
export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    new_password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}
