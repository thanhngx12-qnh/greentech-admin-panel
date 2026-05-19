// File: src/app/(dashboard)/users/components/UserModal.tsx
"use client";

import React, { useEffect } from "react";
import { Modal, Button, Row, Col, App as AntdApp, Alert } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, UserFormInputs, UserRole } from "@/types/user";
import { userService } from "@/lib/services/user.service";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: User | null;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: UserModalProps) {
  const { message } = AntdApp.useApp();
  const isEditing = !!initialData;

  // Định nghĩa Schema động dựa trên trạng thái Edit/Create
  const schema = z.object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    full_name: z.string().min(1, "Họ tên là bắt buộc"),
    role: z.enum(["SUPER_ADMIN", "EDITOR", "SALES"]),
    password: isEditing
      ? z.string().optional() // Khi sửa: không bắt buộc
      : z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"), // Khi tạo: bắt buộc
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      full_name: "",
      role: "EDITOR",
      password: "",
    },
  });

  // Đồng bộ dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          email: initialData.email,
          full_name: initialData.full_name,
          role: initialData.role,
          password: "", // Luôn để trống ô pass khi load form edit
        });
      } else {
        reset({ email: "", full_name: "", role: "EDITOR", password: "" });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      // Loại bỏ password nếu là Edit và user không nhập gì
      const payload = { ...data };
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await userService.updateUser(initialData!.id, payload);
        message.success("Cập nhật thông tin nhân sự thành công");
      } else {
        await userService.createUser(payload);
        message.success("Tạo tài khoản nhân sự thành công");
      }
      onSuccess();
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa tài khoản" : "Tạo tài khoản nhân sự mới"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnHidden // Quy tắc Antd v5
      mask={{ closable: false }} // Quy tắc Antd v5
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {isEditing && (
          <Alert
            title="Lưu ý: Để trống ô mật khẩu nếu bạn không muốn thay đổi mật khẩu của nhân viên này."
            type="info"
            showIcon
            className="mb-6 rounded-[4px]"
          />
        )}

        <Row gutter={16}>
          <Col span={24}>
            <RHFInput
              name="full_name"
              control={control}
              label="Họ và tên nhân viên"
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </Col>
          <Col span={12}>
            <RHFInput
              name="email"
              control={control}
              label="Email (Tên đăng nhập)"
              placeholder="example@greentech.com"
              required
            />
          </Col>
          <Col span={12}>
            <RHFSelect
              name="role"
              control={control}
              label="Quyền hạn hệ thống"
              required
              options={[
                { label: "Quản trị cấp cao", value: "SUPER_ADMIN" },
                { label: "Biên tập viên", value: "EDITOR" },
                { label: "Nhân viên Sales", value: "SALES" },
              ]}
            />
          </Col>
          <Col span={24}>
            <RHFInput
              name="password"
              control={control}
              label={isEditing ? "Đổi mật khẩu mới" : "Mật khẩu khởi tạo"}
              type="password"
              placeholder={isEditing ? "••••••••" : "Tối thiểu 6 ký tự"}
              required={!isEditing}
            />
          </Col>
        </Row>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#E0E0E0]">
          <Button onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-[#2E7D32] px-6"
          >
            {isEditing ? "Lưu thay đổi" : "Tạo tài khoản"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
