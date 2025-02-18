import React from 'react';
import { Table, Select } from 'antd';
import PaginationComponent from "components/PaginationComponent";

const ProductTable = ({
  columns,
  loading,
  products,
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  handlePageProductsChange,
  calculateTotalQuantity
}) => {
  return (
    <>
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={products.map((product, index) => ({
          ...product,
          key: product.id ?? `product-${index}`,
          totalQuantity: calculateTotalQuantity(product.sizes),
        }))}
      />

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        gap: 10,
      }}>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <Select
          value={pageSize}
          style={{ width: 120, marginTop: 20 }}
          onChange={handlePageProductsChange}
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

export default ProductTable;
