import React from "react";
import { Table } from "antd";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const SizeTable = ({ sizeData, handleEditData, handleDelete, loading }) => {
  const columns = [
    { title: "🆔 Danh sách", dataIndex: "id", key: "id" },
    { title: "📏 Tên Kích Thước", dataIndex: "name", key: "name" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <Table
      pagination={false}
      columns={columns}
      loading={loading}
      scroll={{ x: "max-content" }}
      dataSource={sizeData.map((sizes) => ({ ...sizes, key: sizes.id }))}
    />
  );
};

export default SizeTable;
