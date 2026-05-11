import axios from "axios";

// Khởi tạo instance của Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Timeout chặn kẹt quá 15s
});

// Bạn có thể thiết lập thêm Error Handling (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // Luôn bóc data ra cho gọn code khi call
    return response.data;
  },
  (error) => {
    // Có thể bổ sung log ở đây hoặc parse lỗi chuẩn API
    return Promise.reject(error);
  }
);
