import React from "react";
import { Table } from "antd";
import PaginationComponent from "components/User/PaginationComponent";

const ProductAttributesTable = ({
  columns,
  productattributes,
  loading,
}) => {
  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={productattributes.map((sizes) => ({
          ...sizes,
          key: sizes.id,
        }))}
        className="responsive-table"
      />
    </div>
  );
};

export default ProductAttributesTable;
