// File: src/app/(dashboard)/job-postings/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, App as AntdApp } from "antd";
import JobForm from "../components/JobForm";
import { careerService } from "@/lib/services/career.service";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await careerService.getJobById(id);
        if (res.data) {
          setData(res.data);
        } else {
          message.error("Không tìm thấy dữ liệu tin tuyển dụng");
          router.push("/job-postings");
        }
      } catch (error: any) {
        message.error(error.message || "Lỗi khi tải dữ liệu");
        router.push("/job-postings");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, message, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {/* Tuân thủ quy tắc: dùng description thay cho tip */}
        <Spin size="large" description="Đang tải dữ liệu tin tuyển dụng..." />
      </div>
    );
  }

  return <JobForm isEditing={true} initialData={data} id={id} />;
}
