import React, { forwardRef } from 'react';
import { Modal, Typography, Descriptions, Badge, Divider, Tag, Card, Row, Col, Tooltip } from 'antd';
import { ClockCircleOutlined, UserOutlined, LaptopOutlined, GlobalOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const NotificationDetailModal = forwardRef(({ visible, notification, onClose }, ref) => {
  if (!notification) return null;
  
  const getStatusBadge = () => {
    switch (notification.status) {
      case 1:
        return <Badge status="success" text="Hoạt động" />;
      case 0:
        return <Badge status="error" text="Vô hiệu" />;
      default:
        return <Badge status="default" text="Không xác định" />;
    }
  };
  
  const getActionTypeTag = () => {
    const actionType = notification.actionType || '';
    const color = getActionColor(actionType);
    
    return (
      <Tag color={color}>
        {formatActionType(actionType)}
      </Tag>
    );
  };
  
  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'LOGIN':
        return 'green';
      case 'LOGOUT':
        return 'orange';
      case 'LOGIN_FAILED':
        return 'red';
      case 'CREATE_CATEGORIE':
      case 'UPDATE_CATEGORIE':
      case 'DELETE_CATEGORIE':
        return 'blue';
      case 'CREATE_PRODUCT':
      case 'UPDATE_PRODUCT':
      case 'DELETE_PRODUCT':
        return 'purple';
      default:
        return 'default';
    }
  };
  
  const formatActionType = (actionType) => {
    if (!actionType) return '';
    
    switch (actionType) {
      case 'LOGIN':
        return 'Đăng nhập';
      case 'LOGOUT':
        return 'Đăng xuất';
      case 'LOGIN_FAILED':
        return 'Đăng nhập thất bại';
      case 'CREATE_CATEGORIE':
        return 'Thêm danh mục';
      case 'UPDATE_CATEGORIE':
        return 'Cập nhật danh mục';
      case 'DELETE_CATEGORIE':
        return 'Xóa danh mục';
      case 'CREATE_PRODUCT':
        return 'Thêm sản phẩm';
      case 'UPDATE_PRODUCT':
        return 'Cập nhật sản phẩm';
      case 'DELETE_PRODUCT':
        return 'Xóa sản phẩm';
      default:
        return actionType.replace(/_/g, ' ').toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase());
    }
  };
  
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateTime;
    }
  };
  
  const formatNote = (note) => {
    if (!note) return '';
    
    // Split the note by newlines and format each line
    return note.split('\n').map((line, index) => {
      // Add indentation for lines that are details
      if (line.startsWith('- ')) {
        return (
          <div key={index} className="notification-detail-list-item">
            <span className="notification-detail-bullet">•</span> 
            {line.substring(2)}
          </div>
        );
      } else if (line.startsWith('Chi tiết:')) {
        return <div key={index} className="notification-detail-section-header">{line}</div>;
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Chi tiết thông báo</span>
          {getActionTypeTag()}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      maskClosable={true}
      centered
      className="notification-detail-modal"
    >
      <Card className="notification-summary-card" bordered={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="notification-meta-item">
              <ClockCircleOutlined /> 
              <Tooltip title="Thời gian">
                <span>{formatDateTime(notification.historyDateTime)}</span>
              </Tooltip>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="notification-meta-item">
              <UserOutlined />
              <Tooltip title="Người dùng">
                <span>{notification.username || notification.userId || 'N/A'}</span>
              </Tooltip>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="notification-meta-item">
              <GlobalOutlined />
              <Tooltip title="Địa chỉ IP">
                <span>{notification.ipAddress || 'N/A'}</span>
              </Tooltip>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="notification-meta-item">
              <LaptopOutlined />
              <Tooltip title={notification.deviceInfo}>
                <span className="truncate-text">
                  {notification.deviceInfo ? 
                    (notification.deviceInfo.length > 30 ? 
                      `${notification.deviceInfo.substring(0, 30)}...` : 
                      notification.deviceInfo) : 
                    'N/A'
                  }
                </span>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </Card>

      <Divider style={{ margin: '12px 0' }} />
      
      <div className="notification-detail-content">
        <Title level={5}>Thông tin chi tiết</Title>
        <div className="notification-note-container">
          {formatNote(notification.note)}
        </div>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <Descriptions size="small" column={2}>
        <Descriptions.Item label="ID">{notification.idHistory || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">{notification.userRole || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{getStatusBadge()}</Descriptions.Item>
        <Descriptions.Item label="Đã đọc">
          {notification.readStatus === 1 || notification.read ? (
            <Badge status="success" text="Đã đọc" />
          ) : (
            <Badge status="processing" text="Chưa đọc" />
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
});

export default NotificationDetailModal;
