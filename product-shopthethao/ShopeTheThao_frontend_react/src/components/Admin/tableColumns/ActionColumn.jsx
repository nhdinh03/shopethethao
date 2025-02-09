import { Space, Tooltip, Popconfirm } from "antd";
import { Edit, Trash2 } from "lucide-react";

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
        title="Bạn có chắc muốn xoá?"
        okText="Đồng ý"
        cancelText="Huỷ"
        onConfirm={() => handleDelete(record.id)}
      >
        <Tooltip title="Xoá">
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
