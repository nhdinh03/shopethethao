import React from 'react';
import { Table, Select } from 'antd';
import PaginationComponent from "components/PaginationComponent";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const SuppliersTable = ({
  loading,
  suppliers,
  handleEditData,
  handleDelete,
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  handlePageSizeChange,
}) => {
  const columns = [
    { title: "📋 Danh sách", dataIndex: "id", key: "id" },
    { title: "🏢 Nhà cung cấp", dataIndex: "name", key: "name" },
    { title: "📧 Email", dataIndex: "email", key: "email" },
    { title: "📞 Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={suppliers.map((supplier) => ({
          ...supplier,
          key: supplier.id,
        }))}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Select
          value={pageSize}
          style={{ width: 120, marginTop: 20 }}
          onChange={handlePageSizeChange}
        >
          <Select.Option value={5}>5 hàng</Select.Option>
          <Select.Option value={10}>10 hàng</Select.Option>
          <Select.Option value={20}>20 hàng</Select.Option>
          <Select.Option value={50}>50 hàng</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default SuppliersTable;
