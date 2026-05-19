// File: src/components/ui/form/RHFEditor.tsx
import React from "react";
import { Controller, Control } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { mediaService } from "@/lib/services/media.service";

interface RHFEditorProps {
  name: string;
  control: any;
  label: string;
  required?: boolean;
  height?: number;
}

export function RHFEditor({
  name,
  control,
  label,
  required,
  height = 500,
}: RHFEditorProps) {
  // Lấy API Key từ biến môi trường
  const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div className="mb-6">
      <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
        {label} {required && <span className="text-[#D32F2F]">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div
            className={`relative ${error ? "border border-[#D32F2F] rounded-[4px]" : ""}`}
          >
            <Editor
              apiKey={tinymceApiKey} // Đã cập nhật Key chính xác
              value={value || ""}
              onEditorChange={(content) => onChange(content)}
              init={{
                height: height,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | image media link | help",
                content_style: `
                  body { font-family: Inter, sans-serif; font-size: 16px; color: #1b1c1c; }
                  p { margin-bottom: 1rem; }
                  h1, h2, h3, h4, h5, h6 { color: #1b1c1c; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                `,
                skin: "oxide",
                content_css: "default",
                branding: false,
                promotion: false,
                images_upload_handler: async (blobInfo: any) => {
                  try {
                    const file = new File(
                      [blobInfo.blob()],
                      blobInfo.filename(),
                      { type: blobInfo.blob().type },
                    );
                    const res = await mediaService.upload(file);
                    return res.data.location; // Trả về URL cho TinyMCE chèn vào bài
                  } catch (err) {
                    throw {
                      message: "Lỗi khi upload ảnh vào bài viết",
                      remove: true,
                    };
                  }
                },

                // Cho phép kéo thả ảnh trực tiếp vào bài
                paste_data_images: true,
              }}
            />
            {error && (
              <span className="text-[#D32F2F] text-xs mt-1 block">
                {error.message}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
}
