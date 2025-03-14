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
import { SearchOutlined, ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import "./user_historis.scss";
import { userHistoryApi } from "api/Admin";
import UserHistoryDetailModal from './UserHistoryDetailModal';

const { RangePicker } = DatePicker;

const UserHistory = () => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = async () => {
    if (selectedRecord?.readStatus === 0) {
      try {
        await userHistoryApi.markAsRead(selectedRecord.idHistory);
        setHistories(histories.map(item => 
          item.idHistory === selectedRecord.idHistory 
            ? { ...item, readStatus: 1 } 
            : item
        ));
      } catch (error) {
        message.error('Không thể cập nhật trạng thái xem');
      }
    }
    setIsModalVisible(false);
    setSelectedRecord(null);
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
      render: (text, record) => {  // Add record parameter
        const browser = text.match(/Chrome|Firefox|Safari|Edge/i)?.[0] || 'Unknown';
        return (
          <Space direction="vertical" size="small">
            <Tag>{browser}</Tag>
            <span className="ip-address">{`IP: ${record.ipAddress || 'N/A'}`}</span>
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
    },
    {
      title: 'Trạng thái xem',
      dataIndex: 'readStatus',
      key: 'readStatus',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'gold'}>
          {status === 1 ? 'Đã xem' : 'Chưa xem'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined 
            style={{ 
              color: record.readStatus === 0 ? '#1890ff' : '#8c8c8c',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleRowClick(record);
            }}
          />
        </Space>
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
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: record.readStatus === 0 ? 'unread-row' : ''
          })}
          scroll={{ x: 1200 }}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} mục`,
            size: 'default',
            className: 'custom-pagination'
          }}
        />
      </Card>

      <UserHistoryDetailModal
        visible={isModalVisible}
        record={selectedRecord}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default UserHistory;
