import React from 'react';
import { Select } from 'antd';
import PaginationComponent from 'components/User/PaginationComponent'; // Giả sử bạn đã có một component phân trang riêng

const CategoryPagination = ({ totalPages, currentPage, setCurrentPage, pageSize, handlePageSizeChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        onChange={handlePageSizeChange} // Reset trang về 1 mỗi khi thay đổi số hàng
      >
        <Select.Option value={5}>5 hàng</Select.Option>
        <Select.Option value={10}>10 hàng</Select.Option>
        <Select.Option value={20}>20 hàng</Select.Option>
        <Select.Option value={50}>50 hàng</Select.Option>
      </Select>
    </div>
  );
};

export default CategoryPagination;
