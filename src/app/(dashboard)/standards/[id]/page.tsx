// File: src/app/(dashboard)/standards/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, App as AntdApp } from "antd";
import StandardForm from "../components/StandardForm";
import { standardService } from "@/lib/services/standard.service";

export default function EditStandardPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await standardService.getStandardById(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          message.error("Không tìm thấy dữ liệu tiêu chuẩn");
          router.push("/standards");
        }
      } catch (error: any) {
        message.error(error.message || "Lỗi khi tải dữ liệu");
        router.push("/standards");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, message, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {/* Tuân thủ quy tắc: dùng description thay cho tip */}
        <Spin size="large" description="Đang tải dữ liệu tiêu chuẩn..." />
      </div>
    );
  }

  return <StandardForm isEditing={true} initialData={data} id={id} />;
}
