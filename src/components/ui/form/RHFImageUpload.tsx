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
  EyeOutlined,
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

        {/* Nâng cấp Segmented: Thêm Text để dễ nhận biết */}
        <Segmented
          size="small"
          value={mode}
          onChange={(value) => setMode(value)}
          options={[
            { label: "Tải lên", value: "upload", icon: <UploadOutlined /> },
            { label: "Dùng Link", value: "url", icon: <LinkOutlined /> },
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
                message.success("Đã tải ảnh lên");
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
              {/* VÙNG NHẬP LIỆU - FIX CHIỀU CAO 42PX */}
              <div
                className={`flex items-center min-h-[42px] border rounded-[4px] bg-[#fafafa] transition-all px-3 ${
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
                    <div className="w-full flex items-center justify-between cursor-pointer py-1">
                      <div className="flex items-center gap-2 text-[#40493d] overflow-hidden">
                        <UploadOutlined className="text-[#2E7D32]" />
                        <span className="truncate text-[13px]">
                          {uploading
                            ? "Đang xử lý..."
                            : value
                              ? "Thay đổi hình ảnh hiện tại"
                              : "Chọn file từ máy tính"}
                        </span>
                      </div>
                      {uploading && <Spin size="small" />}
                    </div>
                  </Upload>
                ) : (
                  <div className="w-full flex items-center h-full">
                    <LinkOutlined className="text-gray-400 mr-2" />
                    <Input
                      variant="borderless"
                      placeholder="https://example.com/image.jpg"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="p-0 text-[13px] h-full"
                      allowClear
                    />
                  </div>
                )}
              </div>

              {/* VÙNG PREVIEW - THỐNG NHẤT TỈ LỆ */}
              {value ? (
                <div className="relative group border border-[#E0E0E0] rounded-[4px] overflow-hidden bg-white shadow-sm aspect-video flex items-center justify-center">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-contain bg-[#f0f2f5]"
                  />

                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <Button
                      size="small"
                      ghost
                      icon={<EyeOutlined />}
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
                      Gỡ bỏ
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-[#E0E0E0] rounded-[4px] py-6 flex flex-col items-center justify-center bg-gray-50/30">
                  <PictureOutlined className="text-2xl text-gray-300 mb-1" />
                  <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                    Chưa có ảnh
                  </span>
                </div>
              )}

              {error && (
                <span className="text-[#D32F2F] text-[12px] font-medium mt-1 block">
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
