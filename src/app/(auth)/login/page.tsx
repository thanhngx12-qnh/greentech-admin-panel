// File: src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
// Xóa message ở import này, thêm App (đổi tên thành AntdApp)
import { Typography, Input, Button, Alert, App as AntdApp } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginSchema, LoginInputs } from "@/types/auth";
import { authService } from "@/lib/services/auth.service";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sử dụng hook useApp() để gọi message. Đảm bảo message nhận đúng Theme.
  const { message } = AntdApp.useApp();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    setErrorMsg(null);
    try {
      const res = await authService.login(data);
      if (res.success) {
        message.success("Đăng nhập thành công!");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Tài khoản hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="max-w-[440px] w-full bg-white rounded-[4px] border border-[#E0E0E0] shadow-sm p-8">
        <div className="text-center mb-8">
          <Title
            level={3}
            className="text-[#1A1C1E] m-0 tracking-tight font-bold"
          >
            GREENTECH ANALYSIS
          </Title>
          <Text className="text-[#40493d] text-[14px]">
            Hệ thống quản trị dữ liệu chuyên gia
          </Text>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            className="mb-6 rounded-[4px] border-[#ffdad6] bg-[#ffdad6]"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
              Email quản trị
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="admin@greentech.com"
                  className="rounded-[4px] hover:border-[#1976D2] focus:border-[#1976D2]"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email && (
              <span className="text-[#D32F2F] text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
              Mật khẩu
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="rounded-[4px] hover:border-[#1976D2] focus:border-[#1976D2]"
                  status={errors.password ? "error" : ""}
                />
              )}
            />
            {errors.password && (
              <span className="text-[#D32F2F] text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
            className="mt-2 bg-[#2E7D32] hover:bg-[#1b6d24] rounded-[4px] font-medium shadow-none border-none"
          >
            Đăng nhập hệ thống
          </Button>
        </form>
      </div>
    </div>
  );
}
