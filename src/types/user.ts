// File: src/types/user.ts
import { z } from "zod";

export type UserRole = "SUPER_ADMIN" | "EDITOR" | "SALES";

export const userFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .email("Email không đúng định dạng"),
    full_name: z.string().min(1, "Họ tên là bắt buộc"),
    role: z.enum(["EDITOR", "SALES", "SUPER_ADMIN"]),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Logic: Nếu không có ID (tức là tạo mới) thì password bắt buộc >= 6 ký tự
      // Lưu ý: data này sẽ được check kỹ hơn trong Component Modal khi biết đang Edit hay Create
      return true;
    },
    {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
      path: ["password"],
    },
  );

export type UserFormInputs = z.infer<typeof userFormSchema>;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
