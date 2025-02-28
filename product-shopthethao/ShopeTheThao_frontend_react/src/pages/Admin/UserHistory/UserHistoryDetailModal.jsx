import React from 'react';
import { Modal, Descriptions, Tag, Space } from 'antd';
import moment from 'moment';

const UserHistoryDetailModal = ({ visible, record, onClose }) => {
  if (!record) return null;

  return (
    <Modal
      title="Chi tiết lịch sử hoạt động"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record.idHistory}</Descriptions.Item>
        <Descriptions.Item label="Người dùng">
          <Space direction="vertical">
            <span>{record.username}</span>
            <Tag color="purple">{record.userId}</Tag>
            <Tag color="cyan">{record.userRole}</Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Hành động">
          <Tag color={record.status === 1 ? 'success' : 'error'}>
            {record.actionType?.replace(/_/g, ' ')}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{record.note}</Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {moment(record.historyDateTime).format('HH:mm:ss DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Thiết bị">
          {record.deviceInfo}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ IP">
          {record.ipAddress}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserHistoryDetailModal;
