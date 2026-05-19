// File: src/lib/services/audit.service.ts
import axiosInstance from "../api/axios";
import { AuditLogListResponse } from "@/types/audit";

export const auditService = {
  getLogs: async (params: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    user_id?: string;
  }): Promise<AuditLogListResponse> => {
    return axiosInstance.get("/admin/audit-logs", { params });
  },
};
