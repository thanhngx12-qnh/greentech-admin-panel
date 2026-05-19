// File: src/types/audit.ts

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";
export type AuditModule =
  | "NEWS"
  | "SERVICES"
  | "JOB_POSTINGS"
  | "CATEGORIES"
  | "LEADS"
  | "SLIDERS"
  | "USERS"
  | "SETTINGS";

export interface AuditLog {
  id: string;
  action: AuditAction;
  module: AuditModule;
  record_id: string;
  old_data: any;
  new_data: any;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
}

export interface AuditLogListResponse {
  success: boolean;
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
