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
  DatePicker,
  Select
} from "antd";
import moment from 'moment';
import { SearchOutlined, ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import "./user_historis.scss";
import { userHistoryApi } from "api/Admin";
import UserHistoryDetailModal from './UserHistoryDetailModal';
import PaginationComponent from "components/User/PaginationComponent";

const { RangePicker } = DatePicker;

const UserHistory = () => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const response = await userHistoryApi.getAll();
      setHistories(response.data);
      setTotalItems(response.data.length);
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

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1); // Reset to first page when changing date filter
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Filter histories based on search text and date range
  const getFilteredHistories = () => {
    let filtered = [...histories];
    
    // Apply search text filter
    if (searchText) {
      filtered = filtered.filter(item => 
        item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userId?.toString().includes(searchText) ||
        item.userRole?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.actionType?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.deviceInfo?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ipAddress?.includes(searchText)
      );
    }
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      
      filtered = filtered.filter(item => {
        const historyDate = moment(item.historyDateTime);
        return historyDate.isBetween(startDate, endDate, null, '[]');
      });
    }
    
    return filtered;
  };
  
  const filteredHistories = getFilteredHistories();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredHistories.length / pageSize);
  const paginatedHistories = filteredHistories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <div className="size-page">
      <div className="content-wrapper">
        <h2 className="page-title">Lịch sử hoạt động người dùng</h2>
        
        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} md={12} lg={12}>
            <Input
              placeholder="Tìm kiếm theo tên, hành động, thiết bị..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              className="search-input"
              allowClear
            />
          </Col>
          <Col xs={24} md={12} lg={12}>
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              onChange={handleDateRangeChange}
              className="date-range-picker"
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={paginatedHistories}
          loading={loading}
          rowKey="idHistory"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: record.readStatus === 0 ? 'unread-row' : ''
          })}
          scroll={{ x: 1200 }}
          pagination={false}
        />
        
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
        </div>
      </div>

      <UserHistoryDetailModal
        visible={isModalVisible}
        record={selectedRecord}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default UserHistory;
