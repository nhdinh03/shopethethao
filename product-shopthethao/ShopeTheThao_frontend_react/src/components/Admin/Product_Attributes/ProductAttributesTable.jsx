import React from "react";
import { Table } from "antd";
import { IdcardOutlined, FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import ActionColumn from "../tableColumns/ActionColumn";

const ProductAttributesTable = ({
  productattributes,
  loading,
  handleEditData,
  handleDelete
}) => {
  // Custom styles for the header cells
  const headerStyle = {
    backgroundColor: "#f0f5ff",
    color: "#1677ff",
    fontWeight: 600,
    borderRight: "1px solid #f0f0f0"
  };

  const columns = [
    { 
      title: "🆔 ID", 
      dataIndex: "id", 
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
    { 
      title: "📝 Tên Thuộc tính sản phẩm", 
      dataIndex: "name", 
      key: "name",
      width: "70%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
    {
      title: "⚙️ Thao tác",
      ...ActionColumn(handleEditData, handleDelete),
      width: "20%",
      fixed: 'right',
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
  ];

  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={productattributes.map((attr) => ({
          ...attr,
          key: attr.id,
        }))}
        className="responsive-table"
        bordered
      />
    </div>
  );
};

export default ProductAttributesTable;
