import { Tag, Space, Button, Tooltip, Popconfirm } from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const headerStyle = {
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
};

export const createColumns = (showUnlockModal) => [
  {
    title: "Thông tin tài khoản",
    onHeaderCell: () => ({ style: headerStyle }),
    children: [
      {
        title: "Tên tài khoản",
        dataIndex: "id",
        key: "id",
        width: 150,
        onHeaderCell: () => ({ style: headerStyle }),
      },
      {
        title: "Họ tên & Email",
        dataIndex: "fullname",
        key: "fullname",
        width: 250,
        onHeaderCell: () => ({ style: headerStyle }),
        render: (text, record) => (
          <div className="user-info-cell">
            <div className="avatar">
              {record.image ? (
                <img
                  src={`http://localhost:8081/api/upload/${record.image}`}
                  alt={text}
                />
              ) : (
                <div className="avatar-placeholder">
                  {text?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="fullname">{text || "Không có tên"}</div>
              <div className="email">{record.email}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Loại tài khoản",
        key: "accountType",
        width: 120,
        onHeaderCell: () => ({ style: headerStyle }),
        render: (_, record) => {
          const isStaff = record.roles?.some((role) => role.name === "STAFF");
          return (
            <Tag
              color={isStaff ? "purple" : "blue"}
              icon={isStaff ? <TeamOutlined /> : <UserOutlined />}
            >
              {isStaff ? "Nhân viên" : "Khách hàng"}
            </Tag>
          );
        },
      },
    ],
  },
  {
    title: "Thông tin khóa",
    onHeaderCell: () => ({ style: headerStyle }),
    children: [
      {
        title: "Trạng thái",
        key: "status",
        width: 100,
        onHeaderCell: () => ({ style: headerStyle }),
        render: () => (
          <Tag icon={<LockOutlined />} color="red">
            Đã khóa
          </Tag>
        ),
      },
      {
        title: "Lý do khóa",
        dataIndex: "lockReasons",
        key: "lockReasons",
        width: 300,
        onHeaderCell: () => ({ style: headerStyle }),
        render: (lockReasons, record) => (
          <div className="lock-reason">
            {lockReasons?.length > 0 
              ? lockReasons.map(reason => (
                  <div key={reason.id} className="reason-item">
                    {reason.reason}
                  </div>
                ))
              : record.singleLockReason 
                ? <div className="reason-item">{record.singleLockReason}</div>
                : <span className="no-reason">Không có lý do</span>
            }
          </div>
        ),
      },
    ],
  },
  {
    title: "Thao tác",
    key: "actions",
    fixed: "right",
    width: 120,
    onHeaderCell: () => ({ style: headerStyle }),
    render: (_, record) => (
      <Space size="small">
        <Tooltip title="Mở khóa tài khoản">
          <Popconfirm
            title="Bạn có chắc chắn muốn mở khóa tài khoản này?"
            onConfirm={() => showUnlockModal(record)}
            okText="Mở khóa"
            cancelText="Hủy"
            icon={<UnlockOutlined style={{ color: "green" }} />}
          >
            <Button type="primary" icon={<UnlockOutlined />} size="small" />
          </Popconfirm>
        </Tooltip>
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showUnlockModal(record)}
          />
        </Tooltip>
      </Space>
    ),
  },
];
