// File: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đã gỡ rewrites() vì cấu hình BFF Proxy & Gắn Token sẽ được xử lý tại src/middleware.ts
};

export default nextConfig;
