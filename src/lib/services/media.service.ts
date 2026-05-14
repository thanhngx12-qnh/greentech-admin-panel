// File: src/lib/services/media.service.ts
import axiosInstance from "../api/axios";

export const mediaService = {
  upload: async (
    file: File,
  ): Promise<{ success: boolean; data: { location: string } }> => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post("/admin/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
