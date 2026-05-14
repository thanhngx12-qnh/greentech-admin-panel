// File: src/app/(dashboard)/news/components/NewsForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, Tabs, Button, Row, Col, App as AntdApp, Spin } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

import { newsFormSchema, NewsFormInputs, NewsDetail } from "@/types/news";
import { newsService } from "@/lib/services/news.service";
import { categoryService } from "@/lib/services/category.service";
import { Category } from "@/types/category";
import { generateSlug } from "@/utils/string";

import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";
import { RHFEditor } from "@/components/ui/form/RHFEditor";

interface NewsFormProps {
  isEditing: boolean;
  initialData?: NewsDetail | null;
  newsId?: string;
}

export default function NewsForm({
  isEditing,
  initialData,
  newsId,
}: NewsFormProps) {
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<NewsFormInputs>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      category_id: undefined as any,
      status: "DRAFT",
      featured_image: "",
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

  // Tự động tạo slug
  const titleVi = watch("title_vi");
  const titleEn = watch("title_en");
  const titleZh = watch("title_zh");

  useEffect(() => {
    if (!isEditing && titleVi)
      setValue("slug_vi", generateSlug(titleVi), { shouldValidate: true });
  }, [titleVi, isEditing, setValue]);
  useEffect(() => {
    if (!isEditing && titleEn)
      setValue("slug_en", generateSlug(titleEn), { shouldValidate: true });
  }, [titleEn, isEditing, setValue]);
  useEffect(() => {
    if (!isEditing && titleZh)
      setValue("slug_zh", generateSlug(titleZh), { shouldValidate: true });
  }, [titleZh, isEditing, setValue]);

  // Fetch danh sách danh mục
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories({
          type: "NEWS",
          limit: 100,
        });
        if (res.success) setCategories(res.data);
      } catch (error) {
        message.error("Không tải được danh mục");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, [message]);

  // Map initialData vào form
  useEffect(() => {
    if (isEditing && initialData) {
      reset({
        category_id: initialData.category_id,
        status: initialData.status,
        featured_image: initialData.featured_image || "",
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

  const onSubmit = async (data: NewsFormInputs) => {
    try {
      if (isEditing && newsId) {
        await newsService.updateNews(newsId, data);
        message.success("Cập nhật bài viết thành công!");
      } else {
        await newsService.createNews(data);
        message.success("Thêm bài viết thành công!");
      }
      router.push("/news");
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra, vui lòng kiểm tra lại");
    }
  };

  const renderLanguageTab = (
    lang: "vi" | "en" | "zh",
    titleLabel: string,
    slugLabel: string,
    contentLabel: string,
  ) => (
    <div className="space-y-6 mt-4">
      <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
        <Row gutter={16}>
          <Col span={12}>
            <RHFInput
              name={`title_${lang}`}
              control={control}
              label={titleLabel}
              placeholder="Nhập tiêu đề..."
              required={lang === "vi"}
            />
          </Col>
          <Col span={12}>
            <RHFInput
              name={`slug_${lang}`}
              control={control}
              label={slugLabel}
              placeholder="duong-dan-seo"
              required={lang === "vi"}
            />
          </Col>
        </Row>
        <RHFEditor
          name={`content_${lang}`}
          control={control}
          label={contentLabel}
          required={lang === "vi"}
          height={600}
        />
      </Card>

      {/* KHỐI SEO */}
      <Card
        variant="outlined"
        title={
          <span className="text-[#1b1c1c] font-semibold">
            Tối ưu SEO ({lang.toUpperCase()})
          </span>
        }
        className="border-[#E0E0E0] shadow-none"
      >
        <RHFInput
          name={`seo_i18n.${lang}.meta_title`}
          control={control}
          label="Meta Title"
          placeholder="Tiêu đề hiển thị trên Google..."
        />
        <RHFInput
          name={`seo_i18n.${lang}.meta_description`}
          control={control}
          label="Meta Description"
          isTextArea
          textAreaProps={{ rows: 3 }}
          placeholder="Mô tả ngắn gọn..."
        />
        <RHFInput
          name={`seo_i18n.${lang}.og_image`}
          control={control}
          label="OG Image URL (Ảnh chia sẻ MXH)"
          placeholder="https://..."
        />
      </Card>
    </div>
  );

  return (
    <Spin spinning={loadingCategories}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/news")}
            />
            <h2 className="text-2xl m-0 text-[#1b1c1c] font-semibold tracking-tight">
              {isEditing ? "Chỉnh sửa bài viết" : "Thêm mới bài viết"}
            </h2>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            {isEditing ? "Lưu thay đổi" : "Tạo bài viết"}
          </Button>
        </div>

        <Row gutter={24}>
          {/* CỘT TRÁI: Nội dung đa ngôn ngữ */}
          <Col xs={24} lg={16}>
            <Tabs
              type="card"
              className="bg-white p-2 rounded-[4px] border border-[#E0E0E0]"
              items={[
                {
                  key: "vi",
                  label: "Tiếng Việt (Mặc định)",
                  children: renderLanguageTab(
                    "vi",
                    "Tiêu đề",
                    "Đường dẫn (Slug)",
                    "Nội dung bài viết",
                  ),
                },
                {
                  key: "en",
                  label: "English",
                  children: renderLanguageTab("en", "Title", "Slug", "Content"),
                },
                {
                  key: "zh",
                  label: "中文 (Chinese)",
                  children: renderLanguageTab("zh", "标题", "链接", "内容"),
                },
              ]}
            />
          </Col>

          {/* CỘT PHẢI: Cài đặt chung */}
          <Col xs={24} lg={8}>
            <Card
              variant="outlined"
              title={
                <span className="text-[#1b1c1c] font-semibold">
                  Cài đặt chung
                </span>
              }
              className="border-[#E0E0E0] shadow-none mb-6"
            >
              <RHFSelect
                name="category_id"
                control={control}
                label="Danh mục"
                required
                options={categories.map((c) => ({
                  label: c.name_i18n?.vi || "N/A",
                  value: c.id,
                }))}
                placeholder="-- Chọn danh mục --"
              />
              <RHFSelect
                name="status"
                control={control}
                label="Trạng thái"
                required
                options={[
                  { label: "Bản nháp", value: "DRAFT" },
                  { label: "Xuất bản", value: "PUBLISHED" },
                  { label: "Gỡ xuống", value: "UNPUBLISHED" },
                  { label: "Lên lịch", value: "SCHEDULED" },
                ]}
              />
              <RHFInput
                name="featured_image"
                control={control}
                label="Ảnh đại diện (URL)"
                placeholder="https://example.com/image.jpg"
              />
              {/* Box review ảnh */}
              {watch("featured_image") && (
                <div className="mt-2 rounded-[4px] overflow-hidden border border-[#E0E0E0]">
                  <img
                    src={watch("featured_image")}
                    alt="Preview"
                    className="w-full h-auto object-cover max-h-[200px]"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </form>
    </Spin>
  );
}
