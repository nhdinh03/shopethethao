import React from 'react';
import { Table, Space, Button, Popconfirm, Select, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PaginationComponent from "components/User/PaginationComponent";

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
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
      render: (id) => <span className="id-cell">{id}</span>
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => (
        <Tooltip title={name}>
          <div className="name-cell">{name}</div>
        </Tooltip>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (email) => (
        <Tooltip title={email}>
          <div className="email-cell">{email}</div>
        </Tooltip>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 130,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ellipsis: true,
      render: (address) => (
        <Tooltip title={address}>
          <div className="address-cell">{address}</div>
        </Tooltip>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditData(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1100 }}
      />
      <div className="pagination-container">
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
    </>
  );
};

export default SuppliersTable;
