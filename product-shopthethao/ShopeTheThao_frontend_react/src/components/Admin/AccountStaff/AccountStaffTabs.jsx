import React from 'react';
import { Table, Tabs } from 'antd';

const { TabPane } = Tabs;

const AccountStaffTabs = ({
  loading,
  staffList,
  lockedStaff,
  columns,
  lockedColumns
}) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Nhân viên đang hoạt động" key="1">
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          dataSource={staffList.map((staff, index) => ({
            ...staff,
            key: staff.id || `active-${index}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      </TabPane>
      <TabPane tab="Nhân viên bị khóa" key="2">
        <Table
          pagination={false}
          columns={lockedColumns}
          loading={loading}
          dataSource={lockedStaff.map((staff, index) => ({
            ...staff,
            key: staff.id || `locked-${index}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      </TabPane>
    </Tabs>
  );
};

export default AccountStaffTabs;
