import React, { memo, useMemo } from 'react';
import { Table, Tabs } from 'antd';

const AccountStaffTabs = memo(({
  loading,
  staffList = [],
  lockedStaff = [],
  columns,
  lockedColumns
}) => {
  const items = useMemo(() => [
    {
      key: '1',
      label: `Nhân viên đang hoạt động (${staffList.length})`,
      children: (
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          dataSource={staffList.map(staff => ({
            ...staff,
            key: staff.id || `active-${staff.email}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      )
    },
    {
      key: '2', 
      label: `Nhân viên bị khóa (${lockedStaff.length})`,
      children: (
        <Table
          pagination={false}
          columns={lockedColumns}
          loading={loading}
          dataSource={lockedStaff.map(staff => ({
            ...staff,
            key: staff.id || `locked-${staff.email}`,
          }))}
          scroll={{ x: "max-content" }}
        />
      )
    }
  ], [staffList, lockedStaff, columns, lockedColumns, loading]);

  return (
    <Tabs 
      defaultActiveKey="1" 
      items={items}
      className="staff-tabs"
    />
  );
});

AccountStaffTabs.displayName = 'AccountStaffTabs';

export default AccountStaffTabs;