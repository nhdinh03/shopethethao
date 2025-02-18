import React, { useState } from "react";
import { Table, Row, Select, Card, Input, Col, Statistic, Space, DatePicker } from "antd";
import { UserOutlined, CheckCircleOutlined, StopOutlined, SearchOutlined } from "@ant-design/icons";
import { useVerificationsManagement } from "hooks/useVerificationsManagement";
import PaginationComponent from "components/PaginationComponent";

import "../index.scss";
import { TableColumns } from "components/Admin/Verification/TableColumns";



const { RangePicker } = DatePicker;

const Verifications = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data,
    loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    handlePageSizeChange
  } = useVerificationsManagement();

  // Tính toán số liệu thống kê
  const verifiedAccounts = data.filter(item => item.account.verified).length;
  const blockedAccounts = data.filter(item => item.account.status === 0).length;

  return (
    <div style={{ padding: "20px" }}>
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số tài khoản"
              value={totalItems}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã xác thực"
              value={verifiedAccounts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chưa xác thực"
              value={totalItems - verifiedAccounts}
              prefix={<StopOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tài khoản bị chặn"
              value={blockedAccounts}
              prefix={<StopOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Input
            placeholder="Tìm kiếm theo tên/email/số điện thoại"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'verified', label: 'Đã xác thực' },
              { value: 'unverified', label: 'Chưa xác thực' },
              { value: 'blocked', label: 'Đã bị chặn' },
            ]}
          />
        </Space>
      </Card>

      {/* Bảng dữ liệu */}
      <Card>
        <Table
          pagination={false}
          columns={TableColumns()}
          loading={loading}
          dataSource={data}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          gap: 10,
        }}>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <Select
            value={pageSize}
            style={{ width: 120 }}
            onChange={handlePageSizeChange}
          >
            <Select.Option value={5}>5 hàng</Select.Option>
            <Select.Option value={10}>10 hàng</Select.Option>
            <Select.Option value={20}>20 hàng</Select.Option>
            <Select.Option value={50}>50 hàng</Select.Option>
          </Select>
        </div>
      </Card>
    </div>
  );
};

export default Verifications;
