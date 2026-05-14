// File: src/app/(dashboard)/settings/page.tsx
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
  Space,
  Divider,
} from "antd";
import {
  SaveOutlined,
  GlobalOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  CodeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { SETTING_KEYS, SettingValue } from "@/types/setting";
import { settingService } from "@/lib/services/setting.service";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm<Record<string, any>>();

  // 1. Fetch toàn bộ cài đặt khi vào trang
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingService.getSettings(SETTING_KEYS);
        if (res.success) {
          // Res data có dạng: { "hotline": { "value": "..." }, "company_name": { "vi": "..." } }
          // Chúng ta làm phẳng dữ liệu để đưa vào react-hook-form
          const formData: any = {};
          Object.entries(res.data).forEach(([key, val]) => {
            formData[key] = val;
          });
          reset(formData);
        }
      } catch (error) {
        message.error("Không thể tải cấu hình hệ thống");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [reset, message]);

  // 2. Xử lý lưu cài đặt
  const onSubmit = async (data: Record<string, SettingValue>) => {
    setIsSaving(true);
    try {
      await settingService.updateMultipleSettings(data);
      message.success("Đã cập nhật toàn bộ cài đặt hệ thống");
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper render input đa ngôn ngữ cho Setting
  const renderI18nSetting = (key: string, label: string) => (
    <div className="mb-6 p-4 border border-dashed border-[#E0E0E0] rounded-[4px] bg-[#fafafa]">
      <Text strong className="block mb-3">
        <GlobalOutlined /> {label}
      </Text>
      <Row gutter={16}>
        <Col span={8}>
          <RHFInput
            name={`${key}.vi`}
            control={control}
            label="Tiếng Việt"
            placeholder="Nhập tiếng Việt..."
          />
        </Col>
        <Col span={8}>
          <RHFInput
            name={`${key}.en`}
            control={control}
            label="English"
            placeholder="Enter english..."
          />
        </Col>
        <Col span={8}>
          <RHFInput
            name={`${key}.zh`}
            control={control}
            label="中文"
            placeholder="输入中文..."
          />
        </Col>
      </Row>
    </div>
  );

  const tabItems = [
    {
      key: "general",
      label: (
        <span className="px-4">
          <InfoCircleOutlined /> Thông tin chung
        </span>
      ),
      children: (
        <div className="max-w-4xl space-y-6">
          <Row gutter={24}>
            <Col span={12}>
              <RHFImageUpload
                name="site_logo.value"
                control={control}
                label="Website Logo (PNG/SVG)"
              />
            </Col>
            <Col span={12}>
              <RHFImageUpload
                name="site_favicon.value"
                control={control}
                label="Favicon (Icon trình duyệt)"
              />
            </Col>
          </Row>
          {renderI18nSetting("company_name", "Tên công ty / Thương hiệu")}
        </div>
      ),
    },
    {
      key: "contact",
      label: (
        <span className="px-4">
          <PhoneOutlined /> Liên hệ & Địa chỉ
        </span>
      ),
      children: (
        <div className="max-w-4xl space-y-4">
          <Row gutter={16}>
            <Col span={12}>
              <RHFInput
                name="contact_hotline.value"
                control={control}
                label="Số điện thoại Hotline"
              />
            </Col>
            <Col span={12}>
              <RHFInput
                name="contact_email.value"
                control={control}
                label="Email liên hệ"
              />
            </Col>
          </Row>
          {renderI18nSetting("company_address", "Địa chỉ trụ sở chính")}
          <RHFInput
            name="contact_map_url.value"
            control={control}
            label="Link Google Maps Embed (iframe src)"
            isTextArea
            textAreaProps={{ rows: 3 }}
          />
        </div>
      ),
    },
    {
      key: "social",
      label: (
        <span className="px-4">
          <ShareAltOutlined /> Mạng xã hội
        </span>
      ),
      children: (
        <div className="max-w-2xl space-y-2">
          <RHFInput
            name="social_facebook.value"
            control={control}
            label="Link Facebook Fanpage"
            placeholder="https://facebook.com/..."
          />
          <RHFInput
            name="social_linkedin.value"
            control={control}
            label="Link LinkedIn Company"
            placeholder="https://linkedin.com/company/..."
          />
          <RHFInput
            name="social_zalo.value"
            control={control}
            label="Số điện thoại / Link Zalo"
            placeholder="09xx..."
          />
        </div>
      ),
    },
    {
      key: "advanced",
      label: (
        <span className="px-4">
          <CodeOutlined /> Kỹ thuật & SEO
        </span>
      ),
      children: (
        <div className="max-w-4xl space-y-4">
          <RHFInput
            name="google_analytics_id.value"
            control={control}
            label="Google Analytics ID (G-XXXXXXX)"
            placeholder="G-XXXXXXXX"
          />
          <Divider orientation="left">Scripts bổ sung</Divider>
          <Text type="secondary" className="block mb-2 italic">
            Mã Script chèn vào trước thẻ đóng &lt;/header&gt; (Ví dụ: FB Pixel,
            Chat bot...)
          </Text>
          <RHFInput
            name="header_scripts.value"
            control={control}
            label="Header Scripts"
            isTextArea
            textAreaProps={{ rows: 8, style: { fontFamily: "monospace" } }}
          />
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading} description="Đang tải cấu hình hệ thống...">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="m-0 font-semibold tracking-tight">
              Cài đặt hệ thống
            </Title>
            <Text type="secondary">
              Quản lý thông tin định danh, liên hệ và các thông số kỹ thuật toàn
              trang
            </Text>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSaving}
            className="bg-[#2E7D32] h-11 px-8 font-medium shadow-md"
          >
            Lưu tất cả thay đổi
          </Button>
        </div>

        <Card
          variant="outlined"
          className="border-[#E0E0E0] shadow-none p-0"
          styles={{ body: { padding: 0 } }}
        >
          <Tabs
            tabPosition="left"
            items={tabItems}
            className="min-h-[600px] setting-tabs"
            style={{ padding: "16px 0" }}
          />
        </Card>
      </form>

      <style jsx global>{`
        .setting-tabs .ant-tabs-nav {
          width: 220px;
          background: #fbf9f8;
          border-right: 1px solid #e0e0e0;
          margin-right: 0 !important;
        }
        .setting-tabs .ant-tabs-content-holder {
          padding: 24px 40px;
          background: #fff;
        }
        .setting-tabs .ant-tabs-tab {
          padding: 12px 0 !important;
          margin: 4px 0 !important;
          border-radius: 0 !important;
        }
        .setting-tabs .ant-tabs-tab-active {
          background: #fff !important;
          border-right: 2px solid #2e7d32 !important;
          font-weight: 600 !important;
        }
        .setting-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
      `}</style>
    </Spin>
  );
}
