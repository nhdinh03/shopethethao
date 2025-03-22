import React from 'react';
import { Tabs, Table } from 'antd';

const AccountTabs = ({ loading, user, lockedUser, columns, lockedColumns, onChange }) => {
  const items = [
    {
      key: '1',
      label: `Đang hoạt động (${user.length})`,
      children: <Table 
        dataSource={user} 
        columns={columns} 
        loading={loading} 
        scroll={{ x: 1300 }}
        pagination={false}
      />
    },
    {
      key: '2',
      label: `Đã khóa (${lockedUser.length})`,
      children: <Table 
        dataSource={lockedUser} 
        columns={lockedColumns} 
        loading={loading} 
        scroll={{ x: 800 }}
        pagination={false}
      />
    },
  ];

  return (
    <Tabs 
      defaultActiveKey="1" 
      items={items} 
      className="account-tabs"
      onChange={onChange}
    />
  );
};

export default AccountTabs;
