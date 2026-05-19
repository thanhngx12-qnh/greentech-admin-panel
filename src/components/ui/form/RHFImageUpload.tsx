// File: src/components/ui/form/RHFImageUpload.tsx
"use client";

import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  Input,
  Upload,
  Button,
  App as AntdApp,
  Spin,
  Segmented,
  Space,
} from "antd";
import {
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
  PictureOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { mediaService } from "@/lib/services/media.service";

interface RHFImageUploadProps {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
}

export function RHFImageUpload({
  name,
  control,
  label,
  required,
}: RHFImageUploadProps) {
  const { message } = AntdApp.useApp();
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<string | number>("upload");

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-[14px] font-semibold text-[#1b1c1c]">
          {label} {required && <span className="text-[#D32F2F]">*</span>}
        </label>

        {/* Dùng Segmented thay cho Tabs để tiết kiệm diện tích */}
        <Segmented
          size="small"
          value={mode}
          onChange={(value) => setMode(value)}
          options={[
            { value: "upload", icon: <UploadOutlined /> },
            { value: "url", icon: <LinkOutlined /> },
          ]}
          className="bg-gray-100 p-0.5 rounded-[4px]"
        />
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const handleUpload = async (file: File) => {
            setUploading(true);
            try {
              const res = await mediaService.upload(file);
              if (res.success) {
                onChange(res.data.location);
                message.success("Tải ảnh thành công");
              }
            } catch (err: any) {
              message.error(err.message || "Lỗi khi tải ảnh");
            } finally {
              setUploading(false);
            }
            return false;
          };

          return (
            <div className="space-y-3">
              {/* VÙNG NHẬP LIỆU */}
              <div
                className={`p-3 border rounded-[4px] bg-[#fafafa] transition-all ${
                  error
                    ? "border-[#D32F2F] bg-[#fff1f0]"
                    : "border-[#E0E0E0] hover:border-[#2E7D32]"
                }`}
              >
                {mode === "upload" ? (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleUpload}
                    disabled={uploading}
                    className="w-full"
                  >
                    <div className="flex flex-col items-center justify-center py-2 cursor-pointer">
                      {uploading ? (
                        <Spin size="small" description="Đang xử lý..." />
                      ) : (
                        <div className="flex items-center gap-2 text-[#2E7D32] font-medium">
                          <UploadOutlined />
                          <span>
                            {value ? "Thay đổi ảnh" : "Chọn ảnh từ máy tính"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Upload>
                ) : (
                  <Input
                    variant="borderless"
                    placeholder="Dán link ảnh (https://...)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    prefix={<LinkOutlined className="text-gray-400" />}
                    allowClear
                    className="p-0"
                  />
                )}
              </div>

              {/* VÙNG PREVIEW NÂNG CẤP */}
              {value ? (
                <div className="relative group border border-[#E0E0E0] rounded-[4px] overflow-hidden bg-white shadow-sm aspect-video flex items-center justify-center">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-contain bg-gray-50"
                  />

                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <Button
                      size="small"
                      type="primary"
                      icon={<FileImageOutlined />}
                      onClick={() => window.open(value, "_blank")}
                    >
                      Xem ảnh
                    </Button>
                    <Button
                      size="small"
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={() => onChange("")}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-[#E0E0E0] rounded-[4px] py-8 flex flex-col items-center justify-center bg-gray-50/50">
                  <PictureOutlined className="text-3xl text-gray-300 mb-2" />
                  <span className="text-gray-400 text-xs">
                    Chưa có ảnh hiển thị
                  </span>
                </div>
              )}

              {error && (
                <span className="text-[#D32F2F] text-xs font-medium mt-1 block">
                  {error.message}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
