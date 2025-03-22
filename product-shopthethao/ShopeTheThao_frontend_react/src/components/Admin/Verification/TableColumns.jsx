import { Tag } from 'antd';
import AccountInfoCard from './AccountInfoCard';

export const TableColumns = () => [
  {
    title: (
      <div className="column-header">
        <span className="emoji">🆔</span>
        <span>ID</span>
      </div>
    ),
    dataIndex: "id",
    key: "id"
  },
  {
    title: (
      <div className="column-header">
        <span className="emoji">📅</span>
        <span>Thời gian ngày tạo</span>
      </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt"
  },
  {
    title: (
      <div className="column-header">
        <span className="emoji">⏳</span>
        <span>Thời gian được xác minh</span>
      </div>
    ),
    dataIndex: "expiresAt",
    key: "expiresAt"
  },
  {
    title: (
      <div className="column-header">
        <span className="emoji">🔒</span>
        <span>Trạng thái</span>
      </div>
    ),
    dataIndex: "account",
    key: "status",
    render: (account) => (
      <Tag color={account.status === 1 ? "green" : "red"}>
        {account.status === 1 ? "Hoạt động" : "Đã bị chặn"}
      </Tag>
    )
  },
  {
    title: (
      <div className="column-header">
        <span className="emoji">🧑‍💻</span>
        <span>Thông tin tài khoản</span>
      </div>
    ),
    key: "account",
    render: (_, record) => <AccountInfoCard account={record.account} />
  }
];
