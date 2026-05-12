// File: app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FlaskConical, Loader2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosClient from "@/lib/axios";

// 1. Định nghĩa Schema Validate bằng Zod
const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Định nghĩa kiểu dữ liệu từ Schema
type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. Khởi tạo Form với React Hook Form
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Xử lý Submit
  async function onSubmit(values: LoginValues) {
    setIsLoading(true);
    try {
      // BƯỚC A: Gọi API Backend để xác thực
      const response = await axiosClient.post("/auth/login", values);
      const { access_token } = response.data.data;

      // BƯỚC B: Gọi API nội bộ (Route Handler) để lưu Token vào Cookie
      await axios.post("/api/auth/login", { access_token });

      // BƯỚC C: Thông báo và điều hướng
      toast.success("Đăng nhập thành công!", {
        description: "Chào mừng bạn quay trở lại hệ thống Greentech.",
      });

      router.push("/");
      router.refresh(); // Làm mới lại các Server Components
    } catch (error: any) {
      // Xử lý lỗi từ Backend (401, 400, 500...)
      const errorMsg =
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác";
      toast.error("Lỗi đăng nhập", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
              <FlaskConical className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            Greentech Admin
          </CardTitle>
          <CardDescription className="text-base">
            Vui lòng đăng nhập để tiếp tục quản trị hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Trường Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Email quản trị
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="admin@greentech.com"
                          className="pl-10 h-11"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường Mật khẩu */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold">Mật khẩu</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-11"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút Đăng nhập */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Đăng nhập ngay"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
