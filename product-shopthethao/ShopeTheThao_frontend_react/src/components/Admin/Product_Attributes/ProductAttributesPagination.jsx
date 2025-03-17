import React from 'react';
import { Select, Button } from 'antd';
import PaginationComponent from 'components/User/PaginationComponent';

const ProductAttributesPagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  handlePageSizeChange
}) => {
  return (
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
      
      {currentPage < totalPages && (
        <Button
          type="primary"
          className="mobile-load-more"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Xem thêm
        </Button>
      )}
    </div>
  );
};

export default ProductAttributesPagination;
