import React, { useEffect, useState } from "react";
import { Table, message, Tag, Row, Select } from "antd";
import verifications from "api/Admin/Verifications/verificationsApi";
import PaginationComponent from "components/PaginationComponent";
import "..//index.scss";

const Verifications = () => {
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  // Lấy dữ liệu với phân trang
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await verifications.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setData(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id" },
    {
      title: "📅 Thời gian ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "⏳ Thời gian được xác minh",
      dataIndex: "expiresAt",
      key: "expiresAt",
    },
    {
      title: "🔒 Trang Thái",
      dataIndex: "account",
      key: "status",
      render: (account) => (
        <Tag color={account.status === 1 ? "green" : "red"}>
          {account.status === 1 ? "Hoạt động" : "Đã bị chặn"}
        </Tag>
      ),
    },
    {
      title: "🧑‍💻 Thông tin tài khoản", 
      key: "account",
      render: (_, record) => {
        const { account } = record;

        // Hàm để làm mờ các thông tin nhạy cảm
        const maskPhone = (phone) => {
          return phone ? phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2") : "";
        };

        const maskEmail = (email) => {
          return email ? email.replace(/(^.{2})(.*?)(@.*)/, "$1****$3") : "";
        };

        const maskAddress = (address) => {
          return address ? address.replace(/(.{5})(.*)/, "$1*****") : "";
        };

        return (
          <div style={{ padding: 10 }}>
            <Row>
              <div>
                <strong>Tên: </strong>
                {account.fullname} <br />
                <strong>Số điện thoại: </strong>
                {maskPhone(account.phone)} <br />
                <strong>Email: </strong>
                {maskEmail(account.email)} <br />
                <strong>Địa chỉ: </strong>
                {maskAddress(account.address)} <br />
                <strong>Ngày sinh: </strong>
                {new Date(account.birthday).toLocaleDateString()} <br />
                <strong>Điểm: </strong>
                {account.points} <br />
                <strong>Xác thực: </strong>
                <Tag color={account.verified ? "blue" : "orange"}>
                  {account.verified
                    ? "Đã xác thực Tài khoản"
                    : "Chưa xác thực Tài khoản"}
                </Tag>
              </div>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <div >
      <Row>
        <h2 className="H2_all">Thống Kê tài khoản</h2>
        <br />
        <br />
        <br />
        <div className="header-container"></div>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        dataSource={data}
        rowKey="id"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Select
          value={pageSize}
          style={{ width: 120, marginTop: 20 }}
          onChange={handlePageSizeChange} // Reset to page 1 when page size changes
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
