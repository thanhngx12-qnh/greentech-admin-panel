/**
 * Định nghĩa Type Interface lấy từ "openapi.json"
 * Components/Schemas/LoginDto
 */

export interface LoginDto {
  email: string;
  password: string;
}

// Bổ sung type trả về của Endpoint /auth/login
export interface LoginResponseDto {
  access_token: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  EDITOR = "EDITOR",
  SALES = "SALES",
}
