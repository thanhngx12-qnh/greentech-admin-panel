// File: src/app/(dashboard)/sliders/components/SliderModal.tsx
"use client";

import React, { useEffect } from "react";
import { Modal, Tabs, Button, Row, Col, App as AntdApp } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sliderFormSchema,
  SliderFormInputs,
  SliderAdmin,
} from "@/types/slider";
import { sliderService } from "@/lib/services/slider.service";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";
import { RHFInputNumber } from "@/components/ui/form/RHFInputNumber";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";

interface SliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: SliderAdmin | null;
}

export default function SliderModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: SliderModalProps) {
  const { message } = AntdApp.useApp();
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SliderFormInputs>({
    resolver: zodResolver(sliderFormSchema),
    defaultValues: {
      name: "",
      position: "HOME_TOP",
      order: 0,
      is_active: true,
      image_desktop_vi: "",
      image_mobile_vi: "",
      title_vi: "",
      subtitle_vi: "",
      link_url_vi: "",
      image_desktop_en: "",
      title_en: "",
      link_url_en: "",
      image_desktop_zh: "",
      title_zh: "",
      link_url_zh: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map dữ liệu từ content_i18n (JSONB) về cấu trúc phẳng của Form DTO
        const { content_i18n } = initialData;
        reset({
          name: initialData.name,
          position: initialData.position,
          order: initialData.order,
          is_active: initialData.is_active,
          image_desktop_vi: content_i18n?.vi?.image_desktop || "",
          image_mobile_vi: content_i18n?.vi?.image_mobile || "",
          title_vi: content_i18n?.vi?.title || "",
          subtitle_vi: content_i18n?.vi?.subtitle || "",
          link_url_vi: content_i18n?.vi?.link_url || "",
          image_desktop_en: content_i18n?.en?.image_desktop || "",
          title_en: content_i18n?.en?.title || "",
          link_url_en: content_i18n?.en?.link_url || "",
          image_desktop_zh: content_i18n?.zh?.image_desktop || "",
          title_zh: content_i18n?.zh?.title || "",
          link_url_zh: content_i18n?.zh?.link_url || "",
        });
      } else {
        reset({
          name: "",
          position: "HOME_TOP",
          order: 0,
          is_active: true,
          image_desktop_vi: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: SliderFormInputs) => {
    try {
      if (isEditing) {
        await sliderService.updateSlider(initialData.id, data);
        message.success("Cập nhật banner thành công");
      } else {
        await sliderService.createSlider(data);
        message.success("Thêm banner thành công");
      }
      onSuccess();
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra");
    }
  };

  const tabItems = [
    {
      key: "vi",
      label: "Tiếng Việt",
      children: (
        <div className="space-y-2 mt-2">
          <RHFImageUpload
            name="image_desktop_vi"
            control={control}
            label="Ảnh Desktop (VI)"
            required
          />
          <RHFImageUpload
            name="image_mobile_vi"
            control={control}
            label="Ảnh Mobile (VI)"
          />
          <RHFInput name="title_vi" control={control} label="Tiêu đề chính" />
          <RHFInput name="subtitle_vi" control={control} label="Tiêu đề phụ" />
          <RHFInput
            name="link_url_vi"
            control={control}
            label="Đường dẫn (Link URL)"
          />
        </div>
      ),
    },
    {
      key: "en",
      label: "English",
      children: (
        <div className="space-y-2 mt-2">
          <RHFImageUpload
            name="image_desktop_en"
            control={control}
            label="Desktop Image (EN)"
          />
          <RHFInput name="title_en" control={control} label="Title" />
          <RHFInput name="link_url_en" control={control} label="Link URL" />
        </div>
      ),
    },
    {
      key: "zh",
      label: "中文",
      children: (
        <div className="space-y-2 mt-2">
          <RHFImageUpload
            name="image_desktop_zh"
            control={control}
            label="Desktop Image (ZH)"
          />
          <RHFInput name="title_zh" control={control} label="标题 (Title)" />
          <RHFInput
            name="link_url_zh"
            control={control}
            label="链接 (Link URL)"
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={isEditing ? "Cỉnh sửa Banner" : "Thêm Banner mới"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden // Chuẩn Antd v5
      mask={{ closable: false }} // Chuẩn Antd v5
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <Row gutter={16}>
          <Col span={12}>
            <RHFInput
              name="name"
              control={control}
              label="Tên định danh nội bộ"
              required
              placeholder="VD: Home Top Spring"
            />
          </Col>
          <Col span={12}>
            <RHFSelect
              name="position"
              control={control}
              label="Vị trí hiển thị"
              required
              options={[
                { label: "Trang chủ - Đầu", value: "HOME_TOP" },
                { label: "Trang chủ - Giữa", value: "HOME_MIDDLE" },
                { label: "Dịch vụ - Đầu", value: "SERVICES_TOP" },
                { label: "Tin tức - Đầu", value: "NEWS_TOP" },
                { label: "Liên hệ - Đầu", value: "CONTACT_TOP" },
              ]}
            />
          </Col>
        </Row>

        <div className="mb-6 p-4 border border-[#E0E0E0] rounded-[4px] bg-[#fafafa]">
          <Tabs items={tabItems} type="line" />
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <RHFInputNumber
              name="order"
              control={control}
              label="Thứ tự hiển thị"
              placeholder="0"
            />
          </Col>
          <Col span={12}>
            <RHFSelect
              name="is_active"
              control={control}
              label="Trạng thái"
              options={[
                { label: "Đang chạy", value: true },
                { label: "Tạm dừng", value: false },
              ]}
            />
          </Col>
        </Row>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E0E0E0]">
          <Button onClick={onClose}>Hủy bỏ</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            Lưu Banner
          </Button>
        </div>
      </form>
    </Modal>
  );
}
