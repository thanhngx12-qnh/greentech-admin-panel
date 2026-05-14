// File: src/lib/api/axios.ts
import axios, { AxiosError } from "axios";

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api-backend",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // BẮT BUỘC: Cho phép gửi/nhận HTTP-Only Cookie giữa Browser và Server qua Proxy
  withCredentials: true,
});

// Interceptor cho Request: Không cần gắn Bearer Token vì ta dùng HTTP-Only Cookie
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm logic loading toàn cục ở đây nếu cần
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor cho Response: Xử lý lỗi toàn cục và 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data để frontend dễ dùng
    return response.data;
  },
  (error: AxiosError) => {
    // Bắt lỗi 401: Token hết hạn hoặc chưa đăng nhập
    if (error.response?.status === 401) {
      // Vì đang dùng App Router và ở ngoài React Component,
      // cách an toàn nhất là dùng window.location để force redirect về trang login.
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // Format lại lỗi để ném ra cho Component bắt và hiển thị (vd: dùng Antd Message)
    const data = error.response?.data as any;
    const errorMessage =
      data?.message || error.message || "Có lỗi xảy ra, vui lòng thử lại.";

    return Promise.reject(new Error(errorMessage));
  },
);

export default axiosInstance;
