// File: src/app/(dashboard)/services/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, App as AntdApp } from "antd";
import ServiceForm from "../components/ServiceForm";
import { serviceService } from "@/lib/services/service.service";
import { ServiceDetail } from "@/types/service";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const id = params.id as string;
  const [data, setData] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await serviceService.getServiceById(id);
        if (res.success) {
          setData(res.data);
        } else {
          message.error("Không tìm thấy dữ liệu dịch vụ");
          router.push("/services");
        }
      } catch (error: any) {
        message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu");
        router.push("/services");
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
        {/* Đã sửa: Sử dụng description thay cho tip để tránh Warning */}
        <Spin size="large" description="Đang tải dữ liệu dịch vụ..." />
      </div>
    );
  }

  return <ServiceForm isEditing={true} initialData={data} serviceId={id} />;
}
