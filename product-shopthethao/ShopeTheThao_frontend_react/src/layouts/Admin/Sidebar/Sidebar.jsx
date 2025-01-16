import { Menu } from "antd";

const Sidebar = () => {
  return (
    <Menu defaultSelectedKeys={["1"]}>
      <Menu.Item key="1">Dashboard</Menu.Item>
      <Menu.Item key="2">Users</Menu.Item>
      <Menu.Item key="3">Settings</Menu.Item>
    </Menu>
  );
};

export default Sidebar;
