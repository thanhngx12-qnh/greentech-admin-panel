// File: src/app/(dashboard)/standards/components/StandardForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Tabs,
  Button,
  Row,
  Col,
  App as AntdApp,
  Spin,
  Space,
} from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { standardFormSchema, StandardFormInputs } from "@/types/standard";
import { standardService } from "@/lib/services/standard.service";
import { categoryService } from "@/lib/services/category.service";
import { Category } from "@/types/category";
import { generateSlug } from "@/utils/string";

import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";
import { RHFEditor } from "@/components/ui/form/RHFEditor";
import { RHFFileUpload } from "@/components/ui/form/RHFFileUpload";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";

export default function StandardForm({ isEditing, initialData, id }: any) {
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<StandardFormInputs>({
    resolver: zodResolver(standardFormSchema),
    defaultValues: { status: "PUBLISHED" },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await categoryService.getCategories({
          type: "STANDARD",
          limit: 100,
        });
        if (res.success) setCategories(res.data);
        if (isEditing && initialData) {
          reset({
            category_id: initialData.category_id,
            code: initialData.code,
            file_url: initialData.file_url || "",
            status: initialData.status,
            title_vi: initialData.title_i18n?.vi,
            content_vi: initialData.content_i18n?.vi,
            slug_vi: initialData.slug_i18n?.vi,
            // Thêm các ngôn ngữ en, zh tương tự...
            seo_i18n: initialData.seo_i18n || { vi: {}, en: {}, zh: {} },
          });
        }
      } catch (err) {
        message.error("Lỗi tải danh mục");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEditing, initialData, reset, message]);

  const handleManualSlug = (lang: "vi" | "en" | "zh") => {
    const title = watch(`title_${lang}` as any);
    if (!title) return message.warning("Vui lòng nhập tên tiêu chuẩn");
    setValue(`slug_${lang}` as any, generateSlug(title), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: StandardFormInputs) => {
    try {
      if (isEditing) await standardService.updateStandard(id, data);
      else await standardService.createStandard(data);
      message.success("Lưu tiêu chuẩn thành công");
      router.push("/standards");
    } catch (err: any) {
      message.error(err.message || "Lỗi hệ thống");
    }
  };

  const renderLangTab = (lang: "vi" | "en" | "zh", labels: any) => (
    <div className="space-y-6 mt-4">
      <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
        <Row gutter={16}>
          <Col span={12}>
            <RHFInput
              name={`title_${lang}`}
              control={control}
              label={labels.title}
              required={lang === "vi"}
            />
          </Col>
          <Col span={12}>
            <RHFInput
              name={`slug_${lang}`}
              control={control}
              label={labels.slug}
              required={lang === "vi"}
              customAddon={
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleManualSlug(lang)}
                  icon={<PlusOutlined />}
                >
                  Tạo Slug
                </Button>
              }
            />
          </Col>
        </Row>
        <RHFEditor
          name={`content_${lang}`}
          control={control}
          label={labels.content}
          height={400}
        />
      </Card>
      <Card
        variant="outlined"
        title={`SEO (${lang.toUpperCase()})`}
        className="border-[#E0E0E0] shadow-none bg-[#fafafa]"
      >
        <RHFInput
          name={`seo_i18n.${lang}.meta_title`}
          control={control}
          label="Meta Title"
        />
        <RHFInput
          name={`seo_i18n.${lang}.meta_description`}
          control={control}
          label="Meta Description"
          isTextArea
        />
        <RHFImageUpload
          name={`seo_i18n.${lang}.og_image`}
          control={control}
          label="OG Image"
        />
      </Card>
    </div>
  );

  return (
    <Spin spinning={loading} description="Đang tải dữ liệu...">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/standards")}
            />
            <h2 className="text-2xl m-0 font-semibold tracking-tight">
              {isEditing ? "Chỉnh sửa Tiêu chuẩn" : "Thêm mới Tiêu chuẩn"}
            </h2>
          </Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            Lưu tài liệu
          </Button>
        </div>
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Tabs
              type="card"
              className="bg-white p-2 rounded-[4px] border border-[#E0E0E0]"
              items={[
                {
                  key: "vi",
                  label: "Tiếng Việt",
                  children: renderLangTab("vi", {
                    title: "Tên tiêu chuẩn",
                    slug: "Slug SEO",
                    content: "Tóm tắt nội dung",
                  }),
                },
                {
                  key: "en",
                  label: "English",
                  children: renderLangTab("en", {
                    title: "Standard Name",
                    slug: "SEO Slug",
                    content: "Summary",
                  }),
                },
                {
                  key: "zh",
                  label: "中文",
                  children: renderLangTab("zh", {
                    title: "标准名称",
                    slug: "SEO 链接",
                    content: "内容摘要",
                  }),
                },
              ]}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Card
              variant="outlined"
              title="Thông tin định danh & File"
              className="border-[#E0E0E0] shadow-none"
            >
              <RHFInput
                name="code"
                control={control}
                label="Mã Tiêu chuẩn / Quy chuẩn"
                required
                placeholder="VD: QCVN 40:2011/BTNMT"
              />
              <RHFSelect
                name="category_id"
                control={control}
                label="Danh mục thư viện"
                required
                options={categories.map((c) => ({
                  label: c.name_i18n.vi,
                  value: c.id,
                }))}
              />
              <RHFFileUpload
                name="file_url"
                control={control}
                label="Tài liệu đính kèm (PDF)"
              />
              <RHFSelect
                name="status"
                control={control}
                label="Trạng thái"
                required
                options={[
                  { label: "Công khai", value: "PUBLISHED" },
                  { label: "Bản nháp", value: "DRAFT" },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </form>
    </Spin>
  );
}
