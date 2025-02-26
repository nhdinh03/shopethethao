import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Space,
  Tag,
  Row,
  Col,
  Card,
  Input,
  DatePicker
} from "antd";
import moment from 'moment';
import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./user_historis.scss";
import { userHistoryApi } from "api/Admin";

const { RangePicker } = DatePicker;

const UserHistory = () => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const response = await userHistoryApi.getAll();
      setHistories(response.data);
    } catch (error) {
      message.error("Không thể tải lịch sử người dùng!");
    }
    setLoading(false);
  };

  const getActionTypeColor = (type) => {
    const colors = {
      UPDATE_ACCOUNT: 'blue',
      LOGIN: 'green',
      LOGOUT: 'orange',
      LOGIN_FAILED: 'red',
      // Add more action types as needed
    };
    return colors[type] || 'default';
  };

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('HH:mm:ss DD/MM/YYYY');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idHistory',
      key: 'idHistory',
      width: 80,
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <span>{text}</span>
          <Tag color="purple">{record.userId}</Tag>
          <Tag color="cyan">{record.userRole}</Tag>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'actionType',
      key: 'actionType',
      render: (text) => (
        <Tag color={getActionTypeColor(text)}>
          {text.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
    },
    {
      title: 'Thời gian',
      dataIndex: 'historyDateTime',
      key: 'historyDateTime',
      render: (text) => (
        <Space>
          <ClockCircleOutlined />
          {formatDateTime(text)}
        </Space>
      ),
    },
    {
      title: 'Thiết bị',
      dataIndex: 'deviceInfo',
      key: 'deviceInfo',
      render: (text) => {
        const browser = text.match(/Chrome|Firefox|Safari|Edge/i)?.[0] || 'Unknown';
        return (
          <Space direction="vertical" size="small">
            <Tag>{browser}</Tag>
            <span className="ip-address">{`IP: ${histories.ipAddress}`}</span>
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? 'Thành công' : 'Thất bại'}
        </Tag>
      ),
    }
  ];

  return (
    <div className="user-history-page">
      <Card title="Lịch sử hoạt động người dùng" className="history-card">
        <Row gutter={[16, 16]} className="filters">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              onChange={(dates) => {
                // Handle date range filter
              }}
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={histories}
          loading={loading}
          rowKey="idHistory"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default UserHistory;
