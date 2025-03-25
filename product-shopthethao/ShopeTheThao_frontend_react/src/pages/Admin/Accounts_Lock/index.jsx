import React, { useEffect, useState } from "react";
import {
  message,
  Button,
  Select,
  Tag,
  Space,
  Table,
  Alert,
  Row,
  Col,
  Input,
  Tabs,
  Badge,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
} from "antd";
import {
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./accountsLock.scss";
import { accountsUserApi, accountsstaffApi, lockreasonsApi } from "api/Admin";
import PaginationComponent from "components/User/PaginationComponent";
import dayjs from "dayjs";
import { createColumns } from 'components/Admin/AccountsLock/columns';

const { TabPane } = Tabs;

const AccountsLock = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [editLock, setAccountsLock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Add styles
  const headerStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  };

  // Add state for filters
  const [filters, setFilters] = useState({
    searchText: "",
    accountType: "all",
    lockDate: "all",
  });

  // Add state for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
  });

  // Add state for unlock modal
  const [unlockModal, setUnlockModal] = useState({
    visible: false,
    accountData: null,
    loading: false,
  });

  // Add state for filtered data
  const [filteredData, setFilteredData] = useState([]);
  const [lockedData, setLockedData] = useState({ loading: false });

  // Add handlers
  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, searchText: value }));
  };

  const handleAccountTypeChange = (value) => {
    setFilters((prev) => ({ ...prev, accountType: value }));
  };

  const handleLockDateChange = (value) => {
    setFilters((prev) => ({ ...prev, lockDate: value }));
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleResetFilters = () => {
    setFilters({
      searchText: "",
      accountType: "all",
      lockDate: "all",
    });
    setSearchText(""); // Reset search text
    setCurrentPage(1); // Reset to first page
  };

  // Add these new functions
  const showUnlockModal = (record) => {
    setUnlockModal({
      visible: true,
      accountData: record,
      loading: false,
    });
  };

  const handleUnlockAccount = async () => {
    setUnlockModal((prev) => ({ ...prev, loading: true }));
    try {
      await lockreasonsApi.unlockAccount(unlockModal.accountData.id);
      message.success("Tài khoản đã được mở khóa thành công");
      setUnlockModal({ visible: false, accountData: null, loading: false });
      setWorkSomeThing((prev) => !prev); // Refresh list
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Không thể mở khóa tài khoản. Vui lòng thử lại!";
      message.error(errorMsg);
      setUnlockModal((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (editLock) {
      const filtered = editLock.filter((item) => {
        const matchesSearch =
          filters.searchText.toLowerCase() === "" ||
          item.fullname
            ?.toLowerCase()
            .includes(filters.searchText.toLowerCase()) ||
          item.email?.toLowerCase().includes(filters.searchText.toLowerCase());

        const matchesType =
          filters.accountType === "all" ||
          (filters.accountType === "staff" &&
            item.roles?.some((role) => role.name === "STAFF")) ||
          (filters.accountType === "users" &&
            item.roles?.some((role) => role.name === "USER"));

        return matchesSearch && matchesType;
      });
      setFilteredData(filtered);
    }
  }, [editLock, filters]);

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await lockreasonsApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          // Transform the data to combine account and lockReason
          const transformedData = res.data.map((item) => ({
            ...item.account,
            singleLockReason: item.lockReason,
          }));
          setAccountsLock(transformedData);
          setFilteredData(transformedData);
          setTotalItems(res.totalItems);

          // Check and adjust current page if needed
          if (
            currentPage > Math.ceil(res.totalItems / pageSize) &&
            res.totalItems > 0
          ) {
            setCurrentPage(Math.ceil(res.totalItems / pageSize));
          }
          setLoading(false);
        }
      } catch (error) {
        message.error(
          "Không thể lấy danh sách tài khoản bị khóa. Vui lòng thử lại!"
        );
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  // Table columns
  const columns = createColumns(showUnlockModal);

  // Add renderLockReasons function before the return statement
  const renderLockReasons = (accountData) => {
    if (accountData.lockReasons && accountData.lockReasons.length > 0) {
      return accountData.lockReasons.map((reason) => (
        <Alert
          key={reason.id}
          message={reason.reason}
          type="warning"
          showIcon
          style={{ marginBottom: 8 }}
        />
      ));
    } else if (accountData.singleLockReason) {
      return (
        <Alert
          message={accountData.singleLockReason}
          type="warning"
          showIcon
          style={{ marginBottom: 8 }}
        />
      );
    }
    return <span className="no-reason">Không có lý do</span>;
  };

  return (
    <div className="lock-accounts-page">
      <div className="content-wrapper">
        <Row
          justify="space-between"
          align="middle"
          className="header-container"
        >
          <h2 className="page-title">Quản lý tài khoản bị khóa</h2>
          <Space>
            <Badge count={totalItems} showZero>
              <Tag
                color="red"
                icon={<LockOutlined />}
                className="lock-status-tag"
              >
                Tài khoản bị khóa
              </Tag>
            </Badge>
          </Space>
        </Row>
        {/* Filters section */}
        <Row gutter={[16, 16]} className="filters-container"  style={{padding: 10}}>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              style={{ width: "100%" }}
              placeholder="Loại tài khoản"
              value={filters.accountType}
              onChange={handleAccountTypeChange}
              className="filter-select"
              options={[
                { value: "all", label: "Tất cả tài khoản" },
                { value: "users", label: "Khách hàng" },
                { value: "staff", label: "Nhân viên" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              style={{ width: "100%" }}
              placeholder="Thời gian khóa"
              value={filters.lockDate}
              onChange={handleLockDateChange}
              className="filter-select"
              options={[
                { value: "all", label: "Tất cả thời gian" },
                { value: "today", label: "Hôm nay" },
                { value: "week", label: "7 ngày qua" },
                { value: "month", label: "30 ngày qua" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              className="reset-filter-btn"
            >
              Đặt lại bộ lọc
            </Button>
          </Col>
        </Row>
        <Col style={{padding: 10 }}>
          <Input style={{ height: 40}}
            placeholder="Tìm kiếm theo tên, email, lý do..."
            prefix={<SearchOutlined />}
            value={filters.searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            className="search-input"
          />
        </Col>
        {/* Locked accounts table */}
        <div className="table-container">
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            loading={lockedData.loading}
            pagination={false}
            scroll={{ x: 1100 }}
            className="locked-accounts-table"
            locale={{
              emptyText: (
                <div className="empty-table">
                  <LockOutlined style={{ fontSize: 24 }} />
                  <p>Không có tài khoản nào bị khóa</p>
                </div>
              ),
            }}
          />
        </div>
        <Modal
          title={
            <div className="unlock-modal-title">
              <UnlockOutlined style={{ color: "#1677ff", fontSize: "20px" }} />
              <span style={{ marginLeft: "8px", fontWeight: "600" }}>
                Mở khóa tài khoản
              </span>
            </div>
          }
          open={unlockModal.visible}
          onCancel={() =>
            setUnlockModal({
              visible: false,
              accountData: null,
              loading: false,
            })
          }
          footer={[
            <Button
              key="cancel"
              onClick={() =>
                setUnlockModal({
                  visible: false,
                  accountData: null,
                  loading: false,
                })
              }
              size="large"
            >
              Hủy
            </Button>,
            <Button
              key="unlock"
              type="primary"
              icon={<UnlockOutlined />}
              loading={unlockModal.loading}
              onClick={handleUnlockAccount}
              size="large"
            >
              Mở khóa
            </Button>,
          ]}
          width={650}
          centered
        >
          {unlockModal.accountData && (
            <div className="unlock-modal-content">
              {/* Account Information Section */}
              <div className="account-info">
                <div className="account-avatar">
                  {unlockModal.accountData.image ? (
                    <img
                      src={`http://localhost:8081/api/upload/${unlockModal.accountData.image}`}
                      alt={unlockModal.accountData.fullname}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="avatar-placeholder large"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: "600",
                      }}
                    >
                      {unlockModal.accountData.fullname?.[0]?.toUpperCase() ||
                        "?"}
                    </div>
                  )}
                </div>
                <div className="account-details" style={{ marginLeft: "16px" }}>
                  <h3 style={{ margin: "0 0 4px", fontWeight: "600" }}>
                    {unlockModal.accountData.fullname}
                  </h3>
                  <p style={{ margin: "0 0 8px", color: "#666" }}>
                    {unlockModal.accountData.email}
                  </p>
                  <Tag
                    color={
                      unlockModal.accountData.roles?.some(
                        (role) => role.name === "STAFF"
                      )
                        ? "purple"
                        : "blue"
                    }
                  >
                    {unlockModal.accountData.roles?.some(
                      (role) => role.name === "STAFF"
                    )
                      ? "Nhân viên"
                      : "Khách hàng"}
                  </Tag>
                </div>
              </div>

              {/* Unlock Warning Section */}
              <div className="unlock-warning" style={{ marginTop: "24px" }}>
                <Alert
                  message="Thông báo mở khóa tài khoản"
                  description={
                    <div>
                      <p>
                        Bạn đang chuẩn bị mở khóa tài khoản này. Sau khi mở
                        khóa:
                      </p>
                      <ul style={{ paddingLeft: "20px" }}>
                        <li>
                          Tài khoản sẽ được đặt lại trạng thái{" "}
                          <Tag color="green">Đang hoạt động</Tag>
                        </li>
                        <li>Lý do khóa sẽ bị xóa khỏi hệ thống</li>
                        <li>
                          Tài khoản có thể đăng nhập và sử dụng tài khoản bình
                          thường
                        </li>
                      </ul>
                    </div>
                  }
                  type="info"
                  showIcon
                />
              </div>

              {/* Lock Reason Section */}
              <div className="lock-reason-section" style={{ marginTop: "24px" }}>
                <h4 style={{ fontWeight: "600", marginBottom: "8px" }}>
                  Lý do khóa:
                </h4>
                {renderLockReasons(unlockModal.accountData)}
              </div>
            </div>
          )}
        </Modal>
        {/* Pagination section */}
        <div className="pagination-containers">
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
          </Select>
        </div>
        {/* Unlock account modal */}
      </div>
    </div>
  );
};

export default AccountsLock;
