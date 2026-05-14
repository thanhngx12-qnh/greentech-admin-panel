// File: src/app/(dashboard)/news/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, App as AntdApp } from "antd";
import NewsForm from "../components/NewsForm";
import { newsService } from "@/lib/services/news.service";
import { NewsDetail } from "@/types/news";

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const id = params.id as string;
  const [data, setData] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await newsService.getNewsById(id);
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        message.error("Không tìm thấy bài viết hoặc có lỗi xảy ra");
        router.push("/news");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id, message, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Đang tải dữ liệu bài viết..." />
      </div>
    );
  }

  return <NewsForm isEditing={true} initialData={data} newsId={id} />;
}
