// File: src/components/ui/form/RHFFileUpload.tsx
import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Button, Upload, App as AntdApp, Input, Space } from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { mediaService } from "@/lib/services/media.service";

interface RHFFileUploadProps {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
}

export function RHFFileUpload({
  name,
  control,
  label,
  required,
}: RHFFileUploadProps) {
  const { message } = AntdApp.useApp();
  const [uploading, setUploading] = useState(false);

  return (
    <div className="mb-6">
      <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
        {label} {required && <span className="text-[#D32F2F]">*</span>}
      </label>
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
                message.success("Tải tài liệu lên thành công");
              }
            } catch (err: any) {
              message.error("Lỗi khi tải file");
            } finally {
              setUploading(false);
            }
            return false;
          };

          return (
            <div className="space-y-2">
              <Space.Compact className="w-full">
                <Input
                  placeholder="URL tài liệu hoặc tải lên..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  prefix={<LinkOutlined className="text-gray-400" />}
                  className="rounded-l-[4px]"
                />
                <Upload
                  accept=".pdf,.doc,.docx"
                  showUploadList={false}
                  beforeUpload={handleUpload}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Tải PDF
                  </Button>
                </Upload>
                {value && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onChange("")}
                  />
                )}
              </Space.Compact>
              {value && (
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-[4px] flex items-center gap-2">
                  <FilePdfOutlined className="text-red-600" />
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] truncate max-w-[400px]"
                  >
                    {value}
                  </a>
                </div>
              )}
              {error && (
                <span className="text-[#D32F2F] text-xs mt-1 block">
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
