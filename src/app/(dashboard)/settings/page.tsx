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
  SearchOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { SETTING_KEYS, SettingValue } from "@/types/setting";
import { settingService } from "@/lib/services/setting.service";
import { RHFInput } from "@/components/ui/form/RHFInput";
import { RHFImageUpload } from "@/components/ui/form/RHFImageUpload";
import { Alert } from "antd";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { control, handleSubmit, reset } = useForm<Record<string, any>>();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingService.getSettings(SETTING_KEYS);
        if (res.success) {
          const formData: any = {};
          Object.entries(res.data).forEach(([key, val]) => {
            formData[key] = val;
          });
          reset(formData);
        }
      } catch (error) {
        message.error("Lỗi tải cấu hình");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [reset, message]);

  const onSubmit = async (data: Record<string, SettingValue>) => {
    setIsSaving(true);
    try {
      // BƯỚC TRANSFORM DỮ LIỆU:
      // Từ: { "hotline": { "value": "..." }, "site_name": { "vi": "..." } }
      // Sang: [ { key: "hotline", value: {...} }, { key: "site_name", value: {...} } ]
      const bulkData = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));

      // Gọi API Bulk mới
      await settingService.updateBulkSettings(bulkData);

      message.success("Đã cập nhật toàn bộ cài đặt hệ thống (Bulk Update)");
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  const renderI18n = (key: string, label: string, isTextArea = false) => (
    <div className="mb-6 p-4 border border-gray-100 rounded-[4px] bg-[#fafafa]">
      <Text strong className="block mb-3 text-[#2E7D32]">
        <GlobalOutlined /> {label}
      </Text>
      <Row gutter={16}>
        <Col span={8}>
          <RHFInput
            name={`${key}.vi`}
            control={control}
            label="Tiếng Việt"
            isTextArea={isTextArea}
          />
        </Col>
        <Col span={8}>
          <RHFInput
            name={`${key}.en`}
            control={control}
            label="English"
            isTextArea={isTextArea}
          />
        </Col>
        <Col span={8}>
          <RHFInput
            name={`${key}.zh`}
            control={control}
            label="中文"
            isTextArea={isTextArea}
          />
        </Col>
      </Row>
    </div>
  );

  const tabItems = [
    {
      key: "branding",
      label: (
        <span className="px-4">
          <InfoCircleOutlined /> Nhận diện & Logo
        </span>
      ),
      children: (
        <div className="max-w-5xl space-y-6">
          <Row gutter={24}>
            <Col span={8}>
              <RHFImageUpload
                name="site_logo_header.value"
                control={control}
                label="Logo Header"
              />
            </Col>
            <Col span={8}>
              <RHFImageUpload
                name="site_logo_footer.value"
                control={control}
                label="Logo Footer"
              />
            </Col>
            <Col span={8}>
              <RHFImageUpload
                name="site_favicon.value"
                control={control}
                label="Favicon"
              />
            </Col>
          </Row>
          {renderI18n("site_name", "Tên Website / Thương hiệu")}
          {renderI18n("site_slogan", "Slogan công ty")}
        </div>
      ),
    },
    {
      key: "contact",
      label: (
        <span className="px-4">
          <PhoneOutlined /> Liên hệ & Pháp nhân
        </span>
      ),
      children: (
        <div className="max-w-5xl space-y-4">
          <Row gutter={16}>
            <Col span={8}>
              <RHFInput
                name="company_tax_code.value"
                control={control}
                label="Mã số thuế"
              />
            </Col>
            <Col span={8}>
              <RHFInput
                name="contact_hotline.value"
                control={control}
                label="Hotline kinh doanh"
              />
            </Col>
            <Col span={8}>
              <RHFInput
                name="contact_email.value"
                control={control}
                label="Email nhận thông báo"
              />
            </Col>
          </Row>
          {renderI18n("company_full_name", "Tên đầy đủ pháp nhân")}
          {renderI18n("company_address", "Địa chỉ trụ sở")}
          {renderI18n("working_hours", "Thời gian làm việc")}
          <RHFInput
            name="contact_map_embed.value"
            control={control}
            label="Mã nhúng Google Maps (iframe)"
            isTextArea
            textAreaProps={{ rows: 3 }}
          />
        </div>
      ),
    },
    {
      key: "seo",
      label: (
        <span className="px-4">
          <SearchOutlined /> SEO Mặc định
        </span>
      ),
      children: (
        <div className="max-w-5xl space-y-4">
          <Alert
            title="Cấu hình này sẽ được sử dụng nếu Trang chủ hoặc các trang con không có SEO riêng."
            type="info"
            showIcon
            className="mb-4"
          />
          {renderI18n("seo_default_title", "Meta Title mặc định")}
          {renderI18n(
            "seo_default_description",
            "Meta Description mặc định",
            true,
          )}
          {renderI18n(
            "seo_default_keywords",
            "Keywords mặc định (Cách nhau bởi dấu phẩy)",
          )}
          <RHFImageUpload
            name="seo_default_og_image.value"
            control={control}
            label="Ảnh chia sẻ mặc định (OG Image)"
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
            label="Facebook Fanpage"
            prefix="https://facebook.com/"
          />
          <RHFInput
            name="social_linkedin.value"
            control={control}
            label="LinkedIn Company"
            prefix="https://linkedin.com/company/"
          />
          <RHFInput
            name="social_youtube.value"
            control={control}
            label="YouTube Channel"
            prefix="https://youtube.com/"
          />
          <RHFInput
            name="social_zalo_oa.value"
            control={control}
            label="Zalo OA / Phone"
          />
          <RHFInput
            name="social_tiktok.value"
            control={control}
            label="TikTok Profile"
          />
        </div>
      ),
    },
    {
      key: "advanced",
      label: (
        <span className="px-4">
          <CodeOutlined /> Kỹ thuật & Scripts
        </span>
      ),
      children: (
        <div className="max-w-5xl space-y-4">
          <Row gutter={16}>
            <Col span={12}>
              <RHFInput
                name="google_analytics_id.value"
                control={control}
                label="Google Analytics ID"
                placeholder="G-XXXXXX"
              />
            </Col>
            <Col span={12}>
              <RHFInput
                name="facebook_pixel_id.value"
                control={control}
                label="Facebook Pixel ID"
              />
            </Col>
          </Row>
          <RHFInput
            name="google_search_console_id.value"
            control={control}
            label="Google Search Console Verification Tag"
          />
          <Divider orientation="left">Google Indexing API (JSON)</Divider>
          <RHFInput
            name="google_indexing_json.value"
            control={control}
            label="Service Account JSON Content"
            isTextArea
            textAreaProps={{
              rows: 5,
              style: { fontFamily: "monospace", fontSize: "12px" },
            }}
          />
          <Divider orientation="left">Scripts bổ sung</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <RHFInput
                name="header_scripts.value"
                control={control}
                label="Header Scripts (Trước </head>)"
                isTextArea
                textAreaProps={{ rows: 6 }}
              />
            </Col>
            <Col span={12}>
              <RHFInput
                name="footer_scripts.value"
                control={control}
                label="Footer Scripts (Trước </body>)"
                isTextArea
                textAreaProps={{ rows: 6 }}
              />
            </Col>
          </Row>
          {renderI18n("copyright_text", "Dòng bản quyền chân trang")}
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading} description="Đang nạp cấu hình hệ thống...">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <Title level={2} className="m-0 font-semibold tracking-tight">
              Cài đặt hệ thống
            </Title>
            <Text type="secondary">
              Cấu hình toàn bộ thông tin thương hiệu, liên hệ và thông số kỹ
              thuật Website
            </Text>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSaving}
            className="bg-[#2E7D32] h-12 px-10 font-bold shadow-lg"
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
            tabPlacement="left"
            items={tabItems}
            className="min-h-[700px] setting-tabs"
          />
        </Card>
      </form>
      <style jsx global>{`
        .setting-tabs .ant-tabs-nav {
          width: 250px;
          background: #fbf9f8;
          border-right: 1px solid #e0e0e0;
          margin-right: 0 !important;
        }
        .setting-tabs .ant-tabs-content-holder {
          padding: 32px 48px;
          background: #fff;
        }
        .setting-tabs .ant-tabs-tab {
          padding: 14px 0 !important;
          margin: 4px 0 !important;
          border-radius: 0 !important;
          transition: all 0.2s;
        }
        .setting-tabs .ant-tabs-tab-active {
          background: #fff !important;
          border-right: 3px solid #2e7d32 !important;
          font-weight: 700 !important;
        }
        .setting-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
      `}</style>
    </Spin>
  );
}
