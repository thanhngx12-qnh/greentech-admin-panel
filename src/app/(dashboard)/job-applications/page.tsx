// File: src/app/(dashboard)/job-applications/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  App as AntdApp,
  Tag,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  FilePdfOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { careerService } from "@/lib/services/career.service";
import { JobApplication, ApplicationStatus, JobPosting } from "@/types/career";

const { Title } = Typography;
const { Option } = Select;

export default function JobApplicationsPage() {
  const { message } = AntdApp.useApp();

  // States dữ liệu
  const [data, setData] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // States phân trang & lọc
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );
  const [filterJobId, setFilterJobId] = useState<string | undefined>(undefined);

  // Lấy danh sách tin tuyển dụng để làm bộ lọc
  useEffect(() => {
    (async () => {
      const res = await careerService.getJobs({ limit: 100 });
      if (res.data) setJobs(res.data);
    })();
  }, []);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await careerService.getApplications({
        page,
        limit,
        search: searchText || undefined,
        status: filterStatus,
        job_id: filterJobId,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterStatus, filterJobId, message]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Cập nhật trạng thái Inline (Optimistic)
  const handleStatusChange = async (
    id: string,
    newStatus: ApplicationStatus,
  ) => {
    const originalData = [...data];
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      await careerService.updateApplicationStatus(id, newStatus);
      message.success("Đã cập nhật trạng thái hồ sơ");
    } catch (error: any) {
      message.error("Lỗi khi cập nhật trạng thái");
      setData(originalData);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await careerService.exportApplications({
        status: filterStatus,
        job_id: filterJobId,
      });
      message.success("Xuất file thành công");
    } catch (error) {
      message.error("Lỗi khi xuất file");
    } finally {
      setExportLoading(false);
    }
  };

  const statusConfig: Record<
    ApplicationStatus,
    { color: string; label: string }
  > = {
    NEW: { color: "blue", label: "Mới nộp" },
    REVIEWING: { color: "orange", label: "Đang xem xét" },
    INTERVIEW: { color: "purple", label: "Hẹn phỏng vấn" },
    REJECTED: { color: "error", label: "Từ chối" },
    HIRED: { color: "success", label: "Đã tuyển" },
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: "Ứng viên",
      key: "candidate",
      render: (_: any, record: JobApplication) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[#1b1c1c]">
            {record.full_name}
          </span>
          <div className="text-[12px] text-gray-500 space-y-0.5">
            <div>
              <MailOutlined className="mr-1" />
              {record.email}
            </div>
            <div>
              <PhoneOutlined className="mr-1" />
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Vị trí ứng tuyển",
      key: "job",
      render: (_: any, record: JobApplication) => (
        <span className="text-[#1976D2] font-medium italic">
          {record.job?.title_i18n?.vi || "N/A"}
        </span>
      ),
    },
    {
      title: "File CV",
      dataIndex: "cv_url",
      key: "cv_url",
      width: 100,
      align: "center" as const,
      render: (url: string) => (
        <Tooltip title="Xem CV ứng viên">
          <Button
            type="link"
            icon={<FilePdfOutlined style={{ fontSize: "20px" }} />}
            href={url}
            target="_blank"
            className="text-red-600 hover:text-red-500"
          />
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái xử lý",
      key: "status",
      width: 180,
      render: (_: any, record: JobApplication) => (
        <Select
          value={record.status}
          onChange={(val: ApplicationStatus) =>
            handleStatusChange(record.id, val)
          }
          className="w-full"
          options={Object.entries(statusConfig).map(([key, config]) => ({
            value: key,
            label: (
              <Tag color={config.color} className="mr-0">
                {config.label}
              </Tag>
            ),
          }))}
        />
      ),
    },
    {
      title: "Ngày nộp",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0 font-semibold tracking-tight">
          Hồ sơ ứng tuyển (CVs)
        </Title>
        <Button
          icon={<ExportOutlined />}
          loading={exportLoading}
          onClick={handleExport}
          className="border-[#1976D2] text-[#1976D2]"
        >
          Xuất danh sách ứng viên
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tên, Email, SĐT ứng viên..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-64"
            allowClear
          />
          <Select
            placeholder="Lọc theo vị trí"
            className="w-64"
            allowClear
            value={filterJobId}
            onChange={(val) => {
              setFilterJobId(val);
              setPage(1);
            }}
          >
            {jobs.map((job) => (
              <Option key={job.id} value={job.id}>
                {job.title_i18n.vi}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Trạng thái"
            className="w-40"
            allowClear
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setPage(1);
            }}
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <Option key={key} value={key}>
                {config.label}
              </Option>
            ))}
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterJobId(undefined);
              setFilterStatus(undefined);
              setPage(1);
            }}
          >
            Xóa lọc
          </Button>
        </Space>
      </Card>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (p, s) => {
              setPage(p);
              setLimit(s);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
