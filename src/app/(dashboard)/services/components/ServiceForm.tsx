// File: src/app/(dashboard)/services/components/ServiceForm.tsx
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

import {
  serviceFormSchema,
  ServiceFormInputs,
  ServiceDetail,
} from "@/types/service";
import { serviceService } from "@/lib/services/service.service";
import { categoryService } from "@/lib/services/category.service";
import { Category } from "@/types/category";
import { generateSlug } from "@/utils/string";

import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";
import { RHFEditor } from "@/components/ui/form/RHFEditor";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";

interface ServiceFormProps {
  isEditing: boolean;
  initialData?: ServiceDetail | null;
  serviceId?: string;
}

export default function ServiceForm({
  isEditing,
  initialData,
  serviceId,
}: ServiceFormProps) {
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ServiceFormInputs>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      category_id: undefined as any,
      status: "DRAFT",
      featured_image: "",
      price: 0,
      currency: "VND",
      duration: "",
      title_vi: "",
      content_vi: "",
      slug_vi: "",
      title_en: "",
      content_en: "",
      slug_en: "",
      title_zh: "",
      content_zh: "",
      slug_zh: "",
      seo_i18n: { vi: {}, en: {}, zh: {} },
    },
  });

  // Fetch danh mục SERVICE
  useEffect(() => {
    (async () => {
      try {
        const res = await categoryService.getCategories({
          type: "SERVICE",
          limit: 100,
        });
        if (res.success) setCategories(res.data);
      } catch (err) {
        message.error("Không tải được danh mục");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [message]);

  // Load dữ liệu cũ khi Edit
  useEffect(() => {
    if (isEditing && initialData) {
      reset({
        category_id: initialData.category_id,
        status: initialData.status,
        featured_image: initialData.featured_image || "",
        price: Number(initialData.price) || 0,
        currency: initialData.currency || "VND",
        duration: initialData.duration || "",
        title_vi: initialData.title_i18n?.vi || "",
        content_vi: initialData.content_i18n?.vi || "",
        slug_vi: initialData.slug_i18n?.vi || "",
        title_en: initialData.title_i18n?.en || "",
        content_en: initialData.content_i18n?.en || "",
        slug_en: initialData.slug_i18n?.en || "",
        title_zh: initialData.title_i18n?.zh || "",
        content_zh: initialData.content_i18n?.zh || "",
        slug_zh: initialData.slug_i18n?.zh || "",
        seo_i18n: initialData.seo_i18n || { vi: {}, en: {}, zh: {} },
      });
    }
  }, [isEditing, initialData, reset]);

  const handleManualSlug = (lang: "vi" | "en" | "zh") => {
    const titleValue = watch(`title_${lang}` as any);
    if (!titleValue) return message.warning("Vui lòng nhập tên dịch vụ trước");
    setValue(`slug_${lang}` as any, generateSlug(titleValue), {
      shouldValidate: true,
    });
    message.success(`Đã tạo slug ${lang.toUpperCase()}`);
  };

  const onSubmit = async (data: ServiceFormInputs) => {
    try {
      if (isEditing && serviceId) {
        await serviceService.updateService(serviceId, data);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceService.createService(data);
        message.success("Tạo dịch vụ thành công!");
      }
      router.push("/services");
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra");
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
          required={lang === "vi"}
          height={500}
        />
      </Card>
      <Card
        variant="outlined"
        title={
          <span className="text-[15px] font-semibold">
            SEO ({lang.toUpperCase()})
          </span>
        }
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
          textAreaProps={{ rows: 2 }}
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
    <Spin spinning={loadingCats} description="Đang tải danh mục...">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/services")}
            />
            <h2 className="text-2xl m-0 font-semibold tracking-tight">
              {isEditing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
            </h2>
          </Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            Lưu dịch vụ
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
                    title: "Tên dịch vụ",
                    slug: "Slug SEO",
                    content: "Mô tả chi tiết",
                  }),
                },
                {
                  key: "en",
                  label: "English",
                  children: renderLangTab("en", {
                    title: "Service Name",
                    slug: "SEO Slug",
                    content: "Detailed Content",
                  }),
                },
                {
                  key: "zh",
                  label: "中文",
                  children: renderLangTab("zh", {
                    title: "服务名称",
                    slug: "SEO 链接",
                    content: "详细内容",
                  }),
                },
              ]}
            />
          </Col>

          <Col xs={24} lg={8}>
            <Card
              variant="outlined"
              title="Cài đặt & Thương mại"
              className="border-[#E0E0E0] shadow-none mb-6"
            >
              <RHFSelect
                name="category_id"
                control={control}
                label="Danh mục dịch vụ"
                required
                options={categories.map((c) => ({
                  label: c.name_i18n.vi,
                  value: c.id,
                }))}
              />
              <RHFSelect
                name="status"
                control={control}
                label="Trạng thái"
                required
                options={[
                  { label: "Bản nháp", value: "DRAFT" },
                  { label: "Xuất bản", value: "PUBLISHED" },
                  { label: "Tạm ẩn", value: "UNPUBLISHED" },
                ]}
              />
              <Row gutter={12}>
                <Col span={14}>
                  <RHFInput
                    name="price"
                    control={control}
                    label="Giá dự kiến"
                    type="number"
                  />
                </Col>
                <Col span={10}>
                  <RHFSelect
                    name="currency"
                    control={control}
                    label="Đơn vị"
                    options={[
                      { label: "VND", value: "VND" },
                      { label: "USD", value: "USD" },
                    ]}
                  />
                </Col>
              </Row>
              <RHFInput
                name="duration"
                control={control}
                label="Thời gian thực hiện (VD: 3-5 ngày)"
              />
              <RHFImageUpload
                name="featured_image"
                control={control}
                label="Ảnh đại diện dịch vụ"
                required
              />
            </Card>
          </Col>
        </Row>
      </form>
    </Spin>
  );
}
