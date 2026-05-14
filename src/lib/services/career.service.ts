// File: src/lib/services/career.service.ts
import axiosInstance from "../api/axios";
import {
  JobPosting,
  JobFormInputs,
  JobStatus,
  JobType,
  JobApplication,
  ApplicationStatus,
  PaginationMeta,
} from "@/types/career";

export const careerService = {
  // --- JOB POSTINGS APIs ---
  getJobs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }) => {
    return axiosInstance.get<{
      success: boolean;
      data: JobPosting[];
      meta: PaginationMeta;
    }>("/admin/job-postings", { params });
  },

  getJobById: async (id: string) => {
    return axiosInstance.get(`/admin/job-postings/${id}`);
  },

  createJob: async (data: JobFormInputs) => {
    return axiosInstance.post("/admin/job-postings", data);
  },

  updateJob: async (id: string, data: Partial<JobFormInputs>) => {
    return axiosInstance.put(`/admin/job-postings/${id}`, data);
  },

  deleteJob: async (id: string) => {
    return axiosInstance.delete(`/admin/job-postings/${id}`);
  },

  // --- JOB APPLICATIONS APIs ---
  getApplications: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    job_id?: string;
  }) => {
    return axiosInstance.get<{
      success: boolean;
      data: JobApplication[];
      meta: PaginationMeta;
    }>("/admin/job-applications", { params });
  },

  updateApplicationStatus: async (id: string, status: ApplicationStatus) => {
    return axiosInstance.put(`/admin/job-applications/${id}/status`, {
      status,
    });
  },

  exportApplications: async (params: any) => {
    const response: any = await axiosInstance.get(
      "/admin/job-applications/export",
      {
        params,
        responseType: "blob",
      },
    );
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Applications_Report_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
