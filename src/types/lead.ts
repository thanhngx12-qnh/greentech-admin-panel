// File: src/types/lead.ts

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  status: LeadStatus;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  meta: PaginationMeta;
}

export interface LeadResponse {
  success: boolean;
  data: Lead;
}
