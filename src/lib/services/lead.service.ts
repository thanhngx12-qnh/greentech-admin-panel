// File: src/lib/services/lead.service.ts
import axiosInstance from "../api/axios";
import { LeadListResponse, LeadResponse, LeadStatus } from "@/types/lead";

export const leadService = {
  // 1. Lấy danh sách (Có phân trang, search, filter)
  getLeads: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<LeadListResponse> => {
    return axiosInstance.get("/admin/leads", { params });
  },

  // 2. Cập nhật trạng thái
  updateStatus: async (
    id: string,
    status: LeadStatus,
  ): Promise<LeadResponse> => {
    return axiosInstance.put(`/admin/leads/${id}/status`, { status });
  },

  // 3. Xuất file CSV báo cáo
  exportLeads: async (params: {
    status?: string;
    startDate?: string;
    endDate?: string;
    lang?: string;
  }): Promise<void> => {
    // Phải set responseType là blob để nhận dữ liệu dạng file thay vì JSON
    const response: any = await axiosInstance.get("/admin/leads/export", {
      params,
      responseType: "blob",
    });

    // Tạo URL object từ Blob
    const url = window.URL.createObjectURL(new Blob([response]));

    // Tạo thẻ <a> ảo để ép trình duyệt tải file xuống
    const link = document.createElement("a");
    link.href = url;

    // Đặt tên file tự động theo thời gian hiện tại
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `Leads_Report_${dateStr}.csv`);

    document.body.appendChild(link);
    link.click();

    // Dọn dẹp DOM và URL object
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
  },
};
