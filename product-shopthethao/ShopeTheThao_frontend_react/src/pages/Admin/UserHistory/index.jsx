import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  message,
  Space,
  Tag,
  Row,
  Col,
  Card,
  Input,
  DatePicker,
} from "antd";
import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { userHistoryApi } from "api/Admin";
import "./user_historis.scss";

const { RangePicker } = DatePicker;

// Định nghĩa các hằng số tĩnh bên ngoài component
const ACTION_TYPE_COLORS = {
  UPDATE_ACCOUNT: "blue",
  CREATE_ACCOUNT: "cyan",
  DELETE_ACCOUNT: "red",
  LOGIN: "green",
  LOGOUT: "orange",
  LOGIN_FAILED: "red",
  CREATE_PRODUCT: "purple",
  UPDATE_PRODUCT: "geekblue",
  DELETE_PRODUCT: "magenta",
  CREATE_CATEGORIE: "gold",
  UPDATE_CATEGORIE: "lime",
  DELETE_CATEGORIE: "volcano",
};

// Tách logic định dạng
const formatDateTime = (dateTime) =>
  moment(dateTime).format("HH:mm:ss DD/MM/YYYY");
const getActionTypeColor = (type) => ACTION_TYPE_COLORS[type] || "default";

// Tách cột bảng ra ngoài để tránh re-render không cần thiết
const columns = [
  {
    title: "ID",
    dataIndex: "idHistory",
    key: "idHistory",
    width: 80,
    sorter: (a, b) => a.idHistory - b.idHistory,
  },
  {
    title: "Người dùng",
    dataIndex: "username",
    key: "username",
    render: (_, record) => (
      <Space direction="vertical" size="small">
        <span>{record.username}</span>
        <Tag color="purple">{record.userId}</Tag>
        <Tag color="cyan">{record.userRole}</Tag>
      </Space>
    ),
    filters: [
      { text: "ADMIN", value: "ADMIN" },
      { text: "USER", value: "USER" },
    ],
    onFilter: (value, record) => record.userRole.includes(value),
  },
  {
    title: "Hành động",
    dataIndex: "actionType",
    key: "actionType",
    render: (text) => (
      <Tag color={getActionTypeColor(text)}>{text.replace(/_/g, " ")}</Tag>
    ),
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
    width: 200,
    // Có thể tạo component NoteRenderer để hiển thị ghi chú đẹp hơn
  },
  {
    title: "Thời gian",
    dataIndex: "historyDateTime",
    key: "historyDateTime",
    render: (text) => (
      <Space>
        <ClockCircleOutlined />
        {formatDateTime(text)}
      </Space>
    ),
  },
  {
    title: "Thiết bị",
    dataIndex: "deviceInfo",
    key: "deviceInfo",
    render: (text, record) => {
      const browserMatch = text.match(/Chrome|Firefox|Safari|Edge/i);
      const browser = browserMatch ? browserMatch[0] : "Unknown";
      const ipAddress = record.ipAddress || "Không có IP";
      return (
        <Space direction="vertical" size="small">
          <span>{browser}</span>
          <span>{`IP: ${ipAddress}`}</span>
        </Space>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === 1 ? "success" : "error"}>
        {status === 1 ? "Thành công" : "Thất bại"}
      </Tag>
    ),
  },
  {
    title: "Trạng thái đọc",
    dataIndex: "readStatus",
    key: "readStatus",
    render: (readStatus) => (
      <Tag color={readStatus === 1 ? "success" : "error"}>
        {readStatus === 1 ? "Đã xem" : "Chưa xem"}
      </Tag>
    ),
  },
];

const UserHistory = () => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchHistories();
  }, []); // Không cần dependency vì chỉ gọi một lần khi mount

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const response = await userHistoryApi.getAll();
      setHistories(response.data);
    } catch (error) {
      message.error("Không thể tải lịch sử người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return histories.filter((item) => {
      const matchesSearch =
        item.username?.toLowerCase().includes(searchLower) ||
        false ||
        item.userId?.toLowerCase().includes(searchLower) ||
        false ||
        item.note?.toLowerCase().includes(searchLower) ||
        false;

      if (dateRange.length !== 2) return matchesSearch;

      const itemDate = moment(item.historyDateTime);
      return (
        matchesSearch &&
        itemDate.isBetween(dateRange[0], dateRange[1], null, "[]")
      );
    });
  }, [histories, searchText, dateRange]);

  const handleDateRangeChange = (dates) => setDateRange(dates || []);

  return (
    <div className="user-history-page">
      <Card
        title="Lịch sử hoạt động người dùng"
        className="history-card"
        extra={<Tag>{`Tổng số: ${filteredData.length}`}</Tag>}
      >
        <Row gutter={[16, 16]} className="filters">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên, ID hoặc ghi chú..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              onChange={handleDateRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="idHistory"
          scroll={{ x: 1200 }}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} mục`,
            pageSizeOptions: ["5", "10", "20", "50"],
            locale: {
              items_per_page: "/ trang",
              jump_to: "Đến trang",
              page: "",
              prev_page: "Trang trước",
              next_page: "Trang sau",
            },
          }}
        />
      </Card>
    </div>
  );
};

export default UserHistory;
