// File: src/app/(dashboard)/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Tabs,
  Button,
  App as AntdApp,
  Spin,
  Tag,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  changePasswordSchema,
  ProfileUpdateInputs,
  ChangePasswordInputs,
  UserProfile,
} from "@/types/profile";
import { profileService } from "@/lib/services/profile.service";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { message } = AntdApp.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const profileForm = useForm<ProfileUpdateInputs>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const passwordForm = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
  });

  useEffect(() => {
    if (!mounted) return;
    const fetchMe = async () => {
      try {
        const res = await profileService.getMe();
        if (res.success) {
          setUser(res.data);
          profileForm.reset({ full_name: res.data.full_name });
        }
      } catch (error) {
        message.error("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [profileForm, message, mounted]);

  const onUpdateProfile = async (data: ProfileUpdateInputs) => {
    setIsUpdating(true);
    try {
      await profileService.updateMe(data);
      message.success("Cập nhật thông tin thành công");
      if (user) setUser({ ...user, full_name: data.full_name });
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordInputs) => {
    setIsUpdating(true);
    try {
      await profileService.changePassword(data);
      message.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      setTimeout(async () => {
        await authService.logout();
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      message.error(error.message || "Mật khẩu cũ không chính xác");
    } finally {
      setIsUpdating(false);
    }
  };

  const tabItems = [
    {
      key: "info",
      label: (
        <span className="px-4">
          <UserOutlined /> Thông tin cá nhân
        </span>
      ),
      children: (
        /* FIX: Thay max-w-xl bằng max-w-[560px] */
        <div className="max-w-[560px] w-full">
          <Title level={4} className="mb-6 text-[#1b1c1c]">
            Thông tin tài khoản
          </Title>
          <div className="mb-8 flex items-center flex-wrap gap-6">
            <div>
              <Text type="secondary" className="block text-[12px] mb-1">
                Địa chỉ Email
              </Text>
              <Text strong className="text-[15px]">
                {user?.email}
              </Text>
            </div>
            <div>
              <Text type="secondary" className="block text-[12px] mb-1">
                Quyền hạn
              </Text>
              <Tag
                color="gold"
                icon={<SafetyCertificateOutlined />}
                className="rounded-[4px] px-2 py-0.5"
              >
                {user?.role}
              </Tag>
            </div>
          </div>

          <form
            onSubmit={profileForm.handleSubmit(onUpdateProfile)}
            className="space-y-4"
          >
            <RHFInput
              name="full_name"
              control={profileForm.control}
              label="Họ và tên hiển thị"
              placeholder="Nhập họ tên của bạn"
              required
            />
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="bg-[#2E7D32] h-10 px-8 font-medium mt-2"
            >
              Lưu thay đổi
            </Button>
          </form>
        </div>
      ),
    },
    {
      key: "security",
      label: (
        <span className="px-4">
          <LockOutlined /> Bảo mật & Mật khẩu
        </span>
      ),
      children: (
        /* FIX: Thay max-w-xl bằng max-w-[560px] */
        <div className="max-w-[560px] w-full">
          <Title level={4} className="mb-6 text-[#1b1c1c]">
            Thay đổi mật khẩu
          </Title>
          <Text type="secondary" className="block mb-6">
            Mật khẩu mới của bạn phải có ít nhất 6 ký tự để đảm bảo an toàn cho
            tài khoản.
          </Text>
          <form
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            className="space-y-4"
          >
            <RHFInput
              name="old_password"
              control={passwordForm.control}
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="••••••••"
              required
            />
            <RHFInput
              name="new_password"
              control={passwordForm.control}
              label="Mật khẩu mới"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              required
            />
            <RHFInput
              name="confirm_password"
              control={passwordForm.control}
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <Button
              type="primary"
              htmlType="submit"
              danger
              icon={<LockOutlined />}
              loading={isUpdating}
              className="h-10 px-8 font-medium mt-4"
            >
              Cập nhật mật khẩu
            </Button>
          </form>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <Spin spinning={loading} description="Đang nạp dữ liệu hồ sơ...">
      <div className="mb-6">
        <Title
          level={2}
          className="m-0 font-semibold tracking-tight text-[#1b1c1c]"
        >
          Hồ sơ của tôi
        </Title>
        <Text type="secondary">
          Cấu hình thông tin tài khoản cá nhân và thiết lập bảo mật
        </Text>
      </div>

      <Card
        variant="outlined"
        className="border-[#E0E0E0] shadow-none p-0"
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          tabPlacement="left"
          items={tabItems}
          className="min-h-[550px] profile-tabs"
        />
      </Card>

      <style jsx global>{`
        .profile-tabs .ant-tabs-nav {
          width: 250px;
          background: #fbf9f8;
          border-right: 1px solid #e0e0e0;
          margin-right: 0 !important;
        }
        .profile-tabs .ant-tabs-content-holder {
          padding: 40px 48px;
          background: #fff;
        }
        .profile-tabs .ant-tabs-tab {
          padding: 14px 0 !important;
          margin: 4px 0 !important;
          border-radius: 0 !important;
          transition: all 0.2s;
        }
        .profile-tabs .ant-tabs-tab-active {
          background: #fff !important;
          border-right: 3px solid #2e7d32 !important;
          font-weight: 700 !important;
        }
        .profile-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
      `}</style>
    </Spin>
  );
}
