import React from 'react';
import { Card, Row, Tag, Avatar, Typography, Space, Tooltip } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AccountInfoCard = ({ account }) => {
  const maskPhone = (phone) => phone?.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2") || "";
  const maskEmail = (email) => email?.replace(/(^.{2})(.*?)(@.*)/, "$1****$3") || "";
  const maskAddress = (address) => address?.replace(/(.{5})(.*)/, "$1*****") || "";

  return (
    <Card size="small" style={{ width: '100%' }}>
      <Space align="start">
        <Avatar size={64} icon={<UserOutlined />} />
        <Space direction="vertical" size={1}>
          <Text strong>{account.fullname}</Text>
          <Space wrap>
            <Tooltip title="Số điện thoại">
              <Space>
                <PhoneOutlined />
                <Text>{maskPhone(account.phone)}</Text>
              </Space>
            </Tooltip>
            <Tooltip title="Email">
              <Space>
                <MailOutlined />
                <Text>{maskEmail(account.email)}</Text>
              </Space>
            </Tooltip>
          </Space>
          <Tooltip title="Địa chỉ">
            <Space>
              <HomeOutlined />
              <Text>{maskAddress(account.address)}</Text>
            </Space>
          </Tooltip>
          <Space>
            <Tooltip title="Ngày sinh">
              <Space>
                <CalendarOutlined />
                <Text>{new Date(account.birthday).toLocaleDateString()}</Text>
              </Space>
            </Tooltip>
            <Tooltip title="Điểm tích lũy">
              <Space>
                <StarOutlined />
                <Text>{account.points} điểm</Text>
              </Space>
            </Tooltip>
          </Space>
          <Tag color={account.verified ? "blue" : "orange"}>
            {account.verified ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
        </Space>
      </Space>
    </Card>
  );
};

export default AccountInfoCard;
