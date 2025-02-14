import React from 'react';
import { Button, Tooltip, Space } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";

const TableActions = ({ record, onEdit, onDelete, onView }) => (
  <Space size="middle">
    <Tooltip title="Sửa">
      <Button
        type="primary"
        icon={<FontAwesomeIcon icon={faEdit} />}
        onClick={() => onEdit(record)}
      />
    </Tooltip>
    <Tooltip title="Xóa">
      <Button
        danger
        icon={<FontAwesomeIcon icon={faTrashAlt} />}
        onClick={() => onDelete(record.id)}
      />
    </Tooltip>
    <Tooltip title="Xem chi tiết">
      <Button
        icon={<FontAwesomeIcon icon={faPrint} />}
        onClick={() => onView(record)}
      />
    </Tooltip>
  </Space>
);

export default TableActions;
