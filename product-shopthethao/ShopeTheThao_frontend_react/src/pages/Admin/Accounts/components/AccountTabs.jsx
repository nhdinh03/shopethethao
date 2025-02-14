import React from 'react';
import { Table, Tabs } from 'antd';

const { TabPane } = Tabs;

const AccountTabs = ({
  loading,
  user,
  lockedUser,
  columns,
  lockedColumns
}) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Tài khoản đang hoạt động" key="1">
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
      </TabPane>
      <TabPane tab="Tài khoản bị khóa" key="2">
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
      </TabPane>
    </Tabs>
  );
};

export default AccountTabs;
