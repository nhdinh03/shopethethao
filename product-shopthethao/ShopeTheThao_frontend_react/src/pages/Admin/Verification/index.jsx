import React, { useEffect, useState } from "react";
import { Table, message, Row, Select } from "antd";
import verifications from "api/Admin/Verifications/verificationsApi";
import PaginationComponent from "components/PaginationComponent";
import { getColumns } from "./components/TableColumns";
import "../index.scss";

const Verifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await verifications.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setData(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    getList();
    return () => { isMounted = false; };
  }, [currentPage, pageSize, searchText]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

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
