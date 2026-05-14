// File: src/app/(dashboard)/categories/components/CategoryModal.tsx
"use client";

import React, { useEffect } from "react";
import { Modal, Tabs, Button, App as AntdApp, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryFormSchema,
  CategoryFormInputs,
  Category,
} from "@/types/category";
import { categoryService } from "@/lib/services/category.service";
import { generateSlug } from "@/utils/string";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: Category | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CategoryModalProps) {
  const { message } = AntdApp.useApp();
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      slug: "",
      type: "NEWS",
      name_i18n: { vi: "", en: "", zh: "" },
      desc_i18n: { vi: "", en: "", zh: "" },
      order: 0,
      is_active: true,
    },
  });

  const nameVi = watch("name_i18n.vi");
  useEffect(() => {
    if (!isEditing && nameVi) {
      setValue("slug", generateSlug(nameVi), { shouldValidate: true });
    }
  }, [nameVi, isEditing, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          slug: initialData.slug,
          type: initialData.type,
          name_i18n: {
            vi: initialData.name_i18n?.vi || "",
            en: initialData.name_i18n?.en || "",
            zh: initialData.name_i18n?.zh || "",
          },
          desc_i18n: {
            vi: initialData.desc_i18n?.vi || "",
            en: initialData.desc_i18n?.en || "",
            zh: initialData.desc_i18n?.zh || "",
          },
          order: initialData.order || 0,
          is_active: initialData.is_active,
        });
      } else {
        reset({
          slug: "",
          type: "NEWS",
          name_i18n: { vi: "", en: "", zh: "" },
          desc_i18n: { vi: "", en: "", zh: "" },
          order: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: CategoryFormInputs) => {
    try {
      if (isEditing) {
        await categoryService.updateCategory(initialData.id, data);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(data);
        message.success("Thêm mới danh mục thành công!");
      }
      onSuccess();
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const tabItems = [
    {
      key: "vi",
      label: <span className="font-medium">Tiếng Việt (Mặc định)</span>,
      children: (
        <div className="mt-2">
          <RHFInput
            name="name_i18n.vi"
            control={control}
            label="Tên danh mục"
            placeholder="Nhập tên tiếng Việt"
            required
          />
          <RHFInput
            name="desc_i18n.vi"
            control={control}
            label="Mô tả"
            placeholder="Nhập mô tả tiếng Việt"
            isTextArea
            textAreaProps={{ rows: 3 }}
          />
        </div>
      ),
    },
    {
      key: "en",
      label: <span>English</span>,
      children: (
        <div className="mt-2">
          <RHFInput
            name="name_i18n.en"
            control={control}
            label="Category Name"
            placeholder="Enter english name"
          />
          <RHFInput
            name="desc_i18n.en"
            control={control}
            label="Description"
            placeholder="Enter english description"
            isTextArea
            textAreaProps={{ rows: 3 }}
          />
        </div>
      ),
    },
    {
      key: "zh",
      label: <span>中文 (Chinese)</span>,
      children: (
        <div className="mt-2">
          <RHFInput
            name="name_i18n.zh"
            control={control}
            label="分类名称 (Category Name)"
            placeholder="输入中文名称"
          />
          <RHFInput
            name="desc_i18n.zh"
            control={control}
            label="描述 (Description)"
            placeholder="输入中文描述"
            isTextArea
            textAreaProps={{ rows: 3 }}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={isEditing ? "Cập nhật Danh mục" : "Thêm mới Danh mục"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnHidden // Đã sửa theo Antd v5
      mask={{ closable: false }} // Đã sửa theo Antd v5
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-6 border border-[#E0E0E0] p-4 rounded-[4px] bg-[#F5F7FA]">
          <Tabs items={tabItems} type="line" />
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <RHFSelect
              name="type"
              control={control}
              label="Loại danh mục"
              required
              options={[
                { label: "Tin tức", value: "NEWS" },
                { label: "Dịch vụ", value: "SERVICE" },
                { label: "Tiêu chuẩn", value: "STANDARD" },
                { label: "Tuyển dụng", value: "JOB" },
              ]}
            />
          </Col>
          <Col span={12}>
            <RHFInput
              name="slug"
              control={control}
              label="Đường dẫn SEO (Slug)"
              placeholder="duong-dan-seo"
              required
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <RHFInput
              name="order"
              control={control}
              label="Thứ tự hiển thị"
              type="number"
              required
            />
          </Col>
          <Col span={12}>
            <RHFSelect
              name="is_active"
              control={control}
              label="Trạng thái"
              options={[
                { label: "Hoạt động", value: true },
                { label: "Tạm ẩn", value: false },
              ]}
            />
          </Col>
        </Row>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E0E0E0]">
          <Button onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            {isEditing ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
