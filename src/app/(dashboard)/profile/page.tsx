// File: src/app/(dashboard)/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Tabs,
  Button,
  Row,
  Col,
  App as AntdApp,
  Spin,
  Divider,
  Tag,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  ShieldOutlined,
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

  // 1. Form Cập nhật thông tin
  const profileForm = useForm<ProfileUpdateInputs>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // 2. Form Đổi mật khẩu
  const passwordForm = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
  });

  // Fetch dữ liệu cá nhân
  useEffect(() => {
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
  }, [profileForm, message]);

  // Xử lý cập nhật Họ tên
  const onUpdateProfile = async (data: ProfileUpdateInputs) => {
    setIsUpdating(true);
    try {
      await profileService.updateMe(data);
      message.success("Cập nhật thông tin thành công");
      // Cập nhật lại state user tại chỗ
      if (user) setUser({ ...user, full_name: data.full_name });
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  // Xử lý đổi mật khẩu
  const onChangePassword = async (data: ChangePasswordInputs) => {
    setIsUpdating(true);
    try {
      await profileService.changePassword(data);
      message.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");

      // Theo yêu cầu API: Đăng xuất và đá về trang Login
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
        <div className="max-w-xl">
          <Title level={4} className="mb-6">
            Thông tin tài khoản
          </Title>
          <div className="mb-6">
            <Text type="secondary" className="block mb-1">
              Địa chỉ Email (Tên đăng nhập)
            </Text>
            <Text strong className="text-[16px]">
              {user?.email}
            </Text>
            <Divider type="vertical" className="mx-4" />
            <Tag color="gold" icon={<ShieldOutlined />}>
              {user?.role}
            </Tag>
          </div>

          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)}>
            <RHFInput
              name="full_name"
              control={profileForm.control}
              label="Họ và tên"
              placeholder="Nhập họ tên của bạn"
              required
            />
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="bg-[#2E7D32] mt-2"
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
        <div className="max-w-xl">
          <Title level={4} className="mb-6">
            Thay đổi mật khẩu
          </Title>
          <Text type="secondary" className="block mb-6">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            và nên đổi mật khẩu định kỳ 3-6 tháng.
          </Text>

          <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
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
              className="mt-2"
            >
              Đổi mật khẩu
            </Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading} description="Đang tải dữ liệu hồ sơ...">
      <div className="mb-6">
        <Title level={2} className="m-0 font-semibold tracking-tight">
          Hồ sơ của tôi
        </Title>
        <Text type="secondary">
          Quản lý thông tin định danh và các thiết lập bảo mật cá nhân
        </Text>
      </div>

      <Card
        variant="outlined"
        className="border-[#E0E0E0] shadow-none p-0"
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          tabPosition="left"
          items={tabItems}
          className="min-h-[500px] profile-tabs"
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
