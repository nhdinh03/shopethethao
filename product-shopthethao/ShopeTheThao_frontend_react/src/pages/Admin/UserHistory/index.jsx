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
  Typography,
  Modal,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MobileOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { userHistoryApi } from "api/Admin";
import "./user_historis.scss";

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

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

const UserHistory = () => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

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

  // Tách logic định dạng
  const formatDateTime = (dateTime) =>
    moment(dateTime).format("HH:mm:ss DD/MM/YYYY");
  const getActionTypeColor = (type) => ACTION_TYPE_COLORS[type] || "default";

  const NoteDisplay = ({ note, expanded = false }) => {
    if (!note) return null;

    const lines = note.split("\n");
    const firstLine = lines[0];
    const detailLines = lines.slice(1);

    if (!expanded) {
      return (
        <div>
          <Text strong>{firstLine}</Text>
          {detailLines.length > 0 && (
            <Text type="secondary" italic>
              {" "}
              ({detailLines.length} dòng chi tiết)
            </Text>
          )}
        </div>
      );
    }

    return (
      <Space direction="vertical">
        <Text strong>{firstLine}</Text>
        {detailLines.map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
      </Space>
    );
  };

  const DeviceInfoDisplay = ({ deviceInfo, ipAddress }) => {
    const isMobile = deviceInfo.toLowerCase().includes("mobile");
    const browser = deviceInfo.includes("Chrome")
      ? "Chrome"
      : deviceInfo.includes("Firefox")
      ? "Firefox"
      : deviceInfo.includes("Safari")
      ? "Safari"
      : deviceInfo.includes("Edge")
      ? "Edge"
      : "Unknown";

    return (
      <Space direction="vertical" size="small">
        <Space>
          {isMobile ? <MobileOutlined /> : <DesktopOutlined />}
          <Text>{isMobile ? "Mobile" : "Desktop"}</Text>
        </Space>
        <Tag color="blue">{browser}</Tag>
        <Text type="secondary" className="ip-address">
          IP: {ipAddress}
        </Text>
      </Space>
    );
  };

  const handleViewDetail = async (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);

    if (record.readStatus === 0) {
      try {
        setModalLoading(true);
        await userHistoryApi.markAsRead(record.idHistory);
        
        // Update local state to reflect the change
        setHistories(prevHistories =>
          prevHistories.map(item =>
            item.idHistory === record.idHistory
              ? { ...item, readStatus: 1 }
              : item
          )
        );

        // Update the selected record
        setSelectedRecord(prev => ({ ...prev, readStatus: 1 }));

        // Dispatch custom event to notify NotificationDropdown
        const event = new CustomEvent('notificationRead', {
          detail: { idHistory: record.idHistory }
        });
        window.dispatchEvent(event);
      } catch (error) {
        message.error('Không thể cập nhật trạng thái đọc');
      } finally {
        setModalLoading(false);
      }
    }
  };

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
      render: (note) => <NoteDisplay note={note} />,
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
      render: (text, record) => (
        <DeviceInfoDisplay deviceInfo={text} ipAddress={record.ipAddress} />
      ),
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
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <EyeOutlined
          onClick={() => handleViewDetail(record)}
          style={{ 
            color: record.readStatus === 0 ? '#1890ff' : '#999',
            fontSize: '16px'
          }}
        />
      ),
    },
  ];

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

      <Modal
        title={`Chi tiết hoạt động #${selectedRecord?.idHistory}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        confirmLoading={modalLoading}
      >
        {selectedRecord && (
          <Descriptions 
            column={1} 
            bordered
            loading={modalLoading}
          >
            <Descriptions.Item label="Người dùng">
              <Space direction="vertical">
                <Text strong>{selectedRecord.username}</Text>
                <Tag color="purple">{selectedRecord.userId}</Tag>
                <Tag color="cyan">{selectedRecord.userRole}</Tag>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Hành động">
              <Tag color={getActionTypeColor(selectedRecord.actionType)}>
                {selectedRecord.actionType.replace(/_/g, " ")}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Thời gian">
              {formatDateTime(selectedRecord.historyDateTime)}
            </Descriptions.Item>

            <Descriptions.Item label="Ghi chú">
              <NoteDisplay note={selectedRecord.note} expanded={true} />
            </Descriptions.Item>

            <Descriptions.Item label="Thiết bị">
              <DeviceInfoDisplay
                deviceInfo={selectedRecord.deviceInfo}
                ipAddress={selectedRecord.ipAddress}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              <Space direction="vertical">
                <Tag color={selectedRecord.status === 1 ? "success" : "error"}>
                  {selectedRecord.status === 1 ? "Thành công" : "Thất bại"}
                </Tag>
                <Tag color={selectedRecord.readStatus === 1 ? "success" : "warning"}>
                  {selectedRecord.readStatus === 1 ? "Đã xem" : "Chưa xem"}
                </Tag>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserHistory;
