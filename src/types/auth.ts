// File: src/types/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginInputs = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "SUPER_ADMIN" | "EDITOR" | "SALES";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}
