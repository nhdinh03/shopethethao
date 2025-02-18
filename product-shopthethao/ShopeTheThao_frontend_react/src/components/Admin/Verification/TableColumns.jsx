import { Tag } from 'antd';
import AccountInfoCard from './AccountInfoCard';

export const TableColumns = () => [
  { title: "🆔 ID", dataIndex: "id", key: "id" },
  {
    title: "📅 Thời gian ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "⏳ Thời gian được xác minh",
    dataIndex: "expiresAt",
    key: "expiresAt",
  },
  {
    title: "🔒 Trang Thái",
    dataIndex: "account",
    key: "status",
    render: (account) => (
      <Tag color={account.status === 1 ? "green" : "red"}>
        {account.status === 1 ? "Hoạt động" : "Đã bị chặn"}
      </Tag>
    ),
  },
  {
    title: "🧑‍💻 Thông tin tài khoản",
    key: "account",
    render: (_, record) => <AccountInfoCard account={record.account} />
  },
];
