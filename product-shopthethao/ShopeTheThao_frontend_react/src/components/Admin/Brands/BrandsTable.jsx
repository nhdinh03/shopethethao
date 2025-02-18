import React from "react";
import { Table } from "antd";

const BrandsTable = ({ brands, loading, columns }) => {
  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={brands.map((brand) => ({ ...brand, key: brand.id }))}
      />
    </div>
  );
};

export default BrandsTable;
