import React from "react";
import { Table, Input, Typography } from "antd";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import PropTypes from "prop-types";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SizeTable = ({
  sizeData,
  handleEditData,
  handleDelete,
  loading = false
}) => {

  const columns = [
    {
      title: "🆔 Mã số",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: "15%",
    },
    {
      title: "📏 Tên Kích Thước",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kích thước"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
      width: "60%",
    },
    {
      ...ActionColumn(handleEditData, handleDelete),
      width: "25%",
      fixed: 'right'
    },
  ];

  return (
    <div className="size-table-container">

      <Table
        columns={columns}
        dataSource={sizeData.map((size) => ({ ...size, key: size.id }))}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={false}
        bordered
      />
    </div>
  );
};

SizeTable.propTypes = {
  sizeData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleEditData: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SizeTable;
