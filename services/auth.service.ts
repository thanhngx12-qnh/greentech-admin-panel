import axios from "axios";
import { LoginDto } from "../types/dto/auth.dto";

/**
 * Service này đóng vai trò giao tiếp nội bộ trong project NextJS 
 * (Giao tiếp Frontend Browser <=> API Backend-For-Frontend)
 */
export const authService = {
  // Gửi credentials nội bộ lấy http-only cookie
  loginProxy: async (payload: LoginDto) => {
    const response = await axios.post("/api/auth/login", payload);
    return response.data;
  },

  // Gọi lên node xoá cookie để logout
  logoutProxy: async () => {
    const response = await axios.post("/api/auth/logout");
    return response.data;
  }
};
