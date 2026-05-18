// File: src/lib/services/dashboard.service.ts
import axiosInstance from "../api/axios";
import {
  DashboardStats,
  LeadGrowthData,
  SearchKeyword,
  RecentActivity,
  LeadFunnelData,
} from "@/types/dashboard";

export const dashboardService = {
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    return axiosInstance.get<{ success: boolean; data: DashboardStats }>(
      "/admin/dashboard/stats",
      { params },
    );
  },

  getLeadGrowth: async (params?: { startDate?: string; endDate?: string }) => {
    return axiosInstance.get<{ success: boolean; data: LeadGrowthData[] }>(
      "/admin/dashboard/lead-growth",
      { params },
    );
  },

  getTopKeywords: async () => {
    return axiosInstance.get<{ success: boolean; data: SearchKeyword[] }>(
      "/admin/dashboard/top-search-keywords",
    );
  },

  getRecentActivities: async () => {
    return axiosInstance.get<{ success: boolean; data: RecentActivity[] }>(
      "/admin/dashboard/recent-activities",
    );
  },

  getLeadFunnel: async () => {
    return axiosInstance.get<{ success: boolean; data: LeadFunnelData }>(
      "/admin/dashboard/lead-funnel",
    );
  },
};
