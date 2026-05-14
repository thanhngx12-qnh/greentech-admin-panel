// File: src/app/(dashboard)/job-postings/components/JobForm.tsx
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
  DatePicker,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { jobFormSchema, JobFormInputs } from "@/types/career";
import { careerService } from "@/lib/services/career.service";
import { categoryService } from "@/lib/services/category.service";
import { Category } from "@/types/category";
import { generateSlug } from "@/utils/string";

import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFSelect } from "@/components/ui/form/RHFSelect";
import { RHFEditor } from "@/components/ui/form/RHFEditor";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";

export default function JobForm({ isEditing, initialData, id }: any) {
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
  } = useForm<JobFormInputs>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: { status: "DRAFT", type: "FULL_TIME" },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await categoryService.getCategories({
          type: "JOB",
          limit: 100,
        });
        if (res.success) setCategories(res.data);
        if (isEditing && initialData) {
          reset({
            ...initialData,
            title_vi: initialData.title_i18n?.vi,
            description_vi: initialData.description_i18n?.vi,
            slug_vi: initialData.slug_i18n?.vi,
            // Tương tự cho en và zh...
          });
        }
      } catch (err) {
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEditing, initialData, reset, message]);

  const handleManualSlug = (lang: "vi" | "en" | "zh") => {
    const title = watch(`title_${lang}` as any);
    if (!title) return message.warning("Nhập tiêu đề trước");
    setValue(`slug_${lang}` as any, generateSlug(title), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: JobFormInputs) => {
    try {
      if (isEditing) await careerService.updateJob(id, data);
      else await careerService.createJob(data);
      message.success("Lưu tin tuyển dụng thành công");
      router.push("/job-postings");
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
          name={`description_${lang}`}
          control={control}
          label={labels.desc}
          required={lang === "vi"}
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
              onClick={() => router.push("/job-postings")}
            />
            <h2 className="text-2xl m-0 font-semibold tracking-tight">
              {isEditing ? "Sửa tin tuyển dụng" : "Đăng tin mới"}
            </h2>
          </Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            className="bg-[#2E7D32]"
          >
            Lưu tin đăng
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
                    title: "Vị trí tuyển dụng",
                    slug: "Slug SEO",
                    desc: "Mô tả công việc",
                  }),
                },
                {
                  key: "en",
                  label: "English",
                  children: renderLangTab("en", {
                    title: "Job Title",
                    slug: "SEO Slug",
                    desc: "Job Description",
                  }),
                },
                {
                  key: "zh",
                  label: "中文",
                  children: renderLangTab("zh", {
                    title: "招聘职位",
                    slug: "SEO 链接",
                    desc: "职位描述",
                  }),
                },
              ]}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Card
              variant="outlined"
              title="Thông tin chi tiết"
              className="border-[#E0E0E0] shadow-none"
            >
              <RHFSelect
                name="category_id"
                control={control}
                label="Phòng ban / Danh mục"
                required
                options={categories.map((c) => ({
                  label: c.name_i18n.vi,
                  value: c.id,
                }))}
              />
              <RHFSelect
                name="type"
                control={control}
                label="Hình thức làm việc"
                required
                options={[
                  { label: "Toàn thời gian", value: "FULL_TIME" },
                  { label: "Bán thời gian", value: "PART_TIME" },
                  { label: "Thực tập", value: "INTERNSHIP" },
                ]}
              />
              <RHFInput
                name="location"
                control={control}
                label="Địa điểm"
                required
                placeholder="Hà Nội, Hồ Chí Minh..."
              />
              <RHFInput
                name="salary_range"
                control={control}
                label="Mức lương"
                placeholder="15 - 20 triệu, Thỏa thuận..."
              />
              <RHFSelect
                name="status"
                control={control}
                label="Trạng thái"
                required
                options={[
                  { label: "Đang tuyển", value: "OPEN" },
                  { label: "Đã đóng", value: "CLOSED" },
                  { label: "Bản nháp", value: "DRAFT" },
                ]}
              />
              <div className="mb-4">
                <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
                  Hạn nộp hồ sơ
                </label>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      className="w-full h-[36px] rounded-[4px]"
                      placeholder="Chọn ngày"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : null)
                      }
                    />
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </form>
    </Spin>
  );
}
