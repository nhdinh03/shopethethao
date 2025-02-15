import React from 'react';
import { Table, Tooltip, Input } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import ActionColumn from '../tableColumns/ActionColumn';

const CategoryTable = ({ categories, loading, handleEditData, handleDelete }) => {
  const columns = [
    { 
      title: "🆔 ID", 
      dataIndex: "id", 
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "📂 Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "35%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm danh mục"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
      render: (text) => (
        <Tooltip title={text || "Không có tên danh mục"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 35
              ? `${text.substring(0, 15)}...`
              : text || "Không có tên danh mục"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "📝 Mô tả danh mục",
      dataIndex: "description",
      key: "description",
      width: "35%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm mô tả"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.description.toString().toLowerCase().includes(value.toLowerCase()),
      render: (text) => (
        <Tooltip title={text || "Không có mô tả"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 50 ? `${text.substring(0, 50)}...` : text || "Không có mô tả"}
          </span>
        </Tooltip>
      ),
    },
    {
      ...ActionColumn(handleEditData, handleDelete),
      width: "20%",
      fixed: 'right'
    },
  ];

  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: 800 }}
        dataSource={categories.map((categorie) => ({
          ...categorie,
          key: categorie.id,
        }))}
        bordered
      />
    </div>
  );
};

export default CategoryTable;
