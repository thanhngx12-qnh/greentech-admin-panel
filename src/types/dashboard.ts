// File: src/types/dashboard.ts

export interface DashboardStats {
  leads: { total: number; inRange: number };
  careers: { applications: number; openJobs: number };
  content: { news: number; services: number; standards: number };
  system: { users: number; sliders: number };
}

export interface LeadGrowthData {
  date: string;
  count: number;
}

export interface SearchKeyword {
  keyword: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  type: "NEWS" | "SERVICES" | "STANDARDS" | "JOBS";
  status: string;
  updated_at: string;
}

export interface LeadFunnelData {
  NEW: number;
  CONTACTED: number;
  QUALIFIED: number;
  CLOSED: number;
}
