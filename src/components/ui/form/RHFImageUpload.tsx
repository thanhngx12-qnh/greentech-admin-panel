// File: src/components/ui/form/RHFImageUpload.tsx
import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Tabs, Input, Upload, Button, App as AntdApp, Spin } from "antd";
import {
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
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

  return (
    <div className="mb-6">
      <label className="block text-[14px] font-medium text-[#1b1c1c] mb-2">
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
                message.success("Tải ảnh lên thành công");
              }
            } catch (err: any) {
              message.error(err.message || "Lỗi khi tải ảnh");
            } finally {
              setUploading(false);
            }
            return false; // Ngăn Antd tự động upload theo cách cũ
          };

          return (
            <div
              className={`p-4 border rounded-[4px] bg-white ${error ? "border-[#D32F2F]" : "border-[#E0E0E0]"}`}
            >
              <Tabs
                defaultActiveKey="upload"
                size="small"
                type="card"
                items={[
                  {
                    key: "upload",
                    label: (
                      <span>
                        <UploadOutlined /> Tải ảnh lên
                      </span>
                    ),
                    children: (
                      <div className="py-2">
                        <Upload
                          accept="image/*"
                          showUploadList={false}
                          beforeUpload={handleUpload}
                          disabled={uploading}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            loading={uploading}
                            block
                          >
                            Chọn file từ máy tính
                          </Button>
                        </Upload>
                      </div>
                    ),
                  },
                  {
                    key: "url",
                    label: (
                      <span>
                        <LinkOutlined /> Dán đường dẫn
                      </span>
                    ),
                    children: (
                      <div className="py-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          allowClear
                        />
                      </div>
                    ),
                  },
                ]}
              />

              {/* Preview & Delete */}
              {value && (
                <div className="mt-4 relative group border border-[#E0E0E0] rounded-[4px] overflow-hidden bg-[#F5F7FA]">
                  <Spin spinning={uploading}>
                    <img
                      src={value}
                      alt="Preview"
                      className="w-full h-auto max-h-[250px] object-contain mx-auto display-block"
                    />
                  </Spin>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="primary"
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => onChange("")}
                    />
                  </div>
                </div>
              )}
              {error && (
                <span className="text-[#D32F2F] text-xs mt-2 block">
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
