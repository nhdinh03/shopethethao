import React from 'react';
import { Select } from 'antd';
import PaginationComponent from 'components/User/PaginationComponent';

const ProductAttributesPagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  handlePageSizeChange
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 10,
        gap: 10,
      }}
    >
      {/* Gọi component phân trang */}
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Dropdown chọn số lượng hàng */}
      <Select
        value={pageSize}
        style={{ width: 120, marginTop: 20 }}
        onChange={handlePageSizeChange} // ✅ Gọi hàm mới để reset trang về 1
      >
        <Select.Option value={5}>5 hàng</Select.Option>
        <Select.Option value={10}>10 hàng</Select.Option>
        <Select.Option value={20}>20 hàng</Select.Option>
        <Select.Option value={50}>50 hàng</Select.Option>
      </Select>
    </div>
  );
};

export default ProductAttributesPagination;
