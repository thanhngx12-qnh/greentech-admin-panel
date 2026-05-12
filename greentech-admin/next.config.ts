// File: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Khi gọi /api/backend/auth/login ở trình duyệt
        // Next.js sẽ chuyển tiếp sang http://localhost:3000/auth/login
        source: "/api/backend/:path*",
        destination: "http://localhost:3000/:path*",
      },
    ];
  },
};

export default nextConfig;
