// File: types/auth.ts

export type UserRole = "SUPER_ADMIN" | "EDITOR" | "SALES";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}

export interface ApiError {
  success: boolean;
  statusCode: number;
  errorCode: string;
  message: string;
}
