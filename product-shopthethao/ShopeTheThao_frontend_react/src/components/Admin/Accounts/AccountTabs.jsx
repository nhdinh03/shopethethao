import React from 'react';
import { Table, Tabs } from 'antd';

const AccountTabs = ({
  loading,
  user,
  lockedUser,
  columns,
  lockedColumns
}) => {
  const items = [
    {
      key: '1',
      label: `Tài khoản đang hoạt động (${user?.length || 0})`,
      children: (
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          dataSource={user.map((user, index) => ({
            ...user,
            key: user.id || `active-${index}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      )
    },
    {
      key: '2',
      label: `Tài khoản bị khóa (${lockedUser?.length || 0})`,
      children: (
        <Table
          pagination={false}
          columns={lockedColumns}
          loading={loading}
          dataSource={lockedUser.map((user, index) => ({
            ...user,
            key: user.id || `locked-${index}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      )
    }
  ];

  return (
    <Tabs 
      defaultActiveKey="1" 
      items={items}
      className="account-tabs"
    />
  );
};

export default AccountTabs;