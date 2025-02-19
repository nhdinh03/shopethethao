import React from 'react';
import { Table, Tabs } from 'antd';

const AccountStaffTabs = ({
  loading,
  staffList,
  lockedStaff,
  columns,
  lockedColumns
}) => {
  const items = [
    {
      key: '1',
      label: `Nhân viên đang hoạt động (${staffList?.length || 0})`,
      children: (
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
      )
    },
    {
      key: '2',
      label: `Nhân viên bị khóa (${lockedStaff?.length || 0})`,
      children: (
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
      )
    }
  ];

  return (
    <Tabs 
      defaultActiveKey="1" 
      items={items}
      className="staff-tabs"
    />
  );
};

export default AccountStaffTabs;