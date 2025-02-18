import React from "react";
import { Table, Select } from "antd";
import PaginationComponent from "components/PaginationComponent";

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
      />
      
    </div>
  );
};

export default ProductAttributesTable;
