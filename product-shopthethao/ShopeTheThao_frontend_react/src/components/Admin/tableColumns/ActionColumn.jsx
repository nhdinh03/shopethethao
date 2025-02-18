import { Space, Tooltip, Popconfirm } from "antd";
import { Edit, Trash2 } from "lucide-react";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ActionColumn = (handleEditData, handleDelete) => ({
  title: "⚙️ Thao tác",
  key: "actions",
  render: (_, record) => (
    <Space size="middle">
      <Tooltip title="Chỉnh sửa">
        <Edit
          className="text-green-500 cursor-pointer hover:scale-110 transition"
          size={18}
          onClick={() => handleEditData(record)}
        />
      </Tooltip>
      <Popconfirm
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            <span>Xác nhận xóa</span>
          </div>
        }
        description="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác!"
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
        }}
        onConfirm={() => handleDelete(record.id)}
      >
        <Tooltip title="Xóa">
          <Trash2
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            size={18}
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  ),
});

export default ActionColumn;