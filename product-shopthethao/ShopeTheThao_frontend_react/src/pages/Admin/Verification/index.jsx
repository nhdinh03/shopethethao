import React from "react";
import { Table, Row, Select } from "antd";
import { useVerificationsManagement } from "hooks/useVerificationsManagement";
import PaginationComponent from "components/PaginationComponent";
import { getColumns } from "./components/TableColumns";
import "../index.scss";

const Verifications = () => {
  const {
    data,
    loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    handlePageSizeChange
  } = useVerificationsManagement();

  return (
    <div>
      <Row>
        <h2 className="H2_all">
          Thống Kê tài khoản
          <p>Tổng số tài khoản hiện có: {totalItems}</p>
        </h2>
        <br /><br /><br /><br />
        <div className="header-container"></div>
      </Row>

      <Table
        pagination={false}
        columns={getColumns()}
        loading={loading}
        dataSource={data}
        rowKey="id"
      />

      <div style={{
        display: "flex",
        justifyContent: "center",
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
          onChange={handlePageSizeChange}
        >
          <Select.Option value={5}>5 hàng</Select.Option>
          <Select.Option value={10}>10 hàng</Select.Option>
          <Select.Option value={20}>20 hàng</Select.Option>
          <Select.Option value={50}>50 hàng</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default Verifications;
