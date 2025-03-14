import { useEffect, useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Layout, Button, Skeleton, Drawer, FloatButton } from "antd";
import { HeaderAdminLeft, HeaderAdminRight } from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import Bread from "./Breadcrumb/Breadcrumb";
import LayoutPageDefault from "layouts/LayoutPageDefault";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // Sidebar Desktop
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Sidebar Mobile
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTopSlow = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout
      className={`w-full min-h-screen}`}
      style={{ overflowX: "hidden" }}
    >
      {/* Sidebar - Desktop */}
      <Sider
        theme="light"
        // collapsible
        collapsed={collapsed}
        width={320}
        className="hidden lg:block transition-all duration-300"
      >
        <Header className="flex items-center bg-white px-4">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl"
          />
          <HeaderAdminLeft collapsed={collapsed} />
        </Header>
        <Sidebar />
      </Sider>
      {/* Sidebar - Mobile */}
      <Drawer
        placement="left"
        closable={false} // ✅ Tắt nút mặc định của Ant Design
        onClose={() => setIsMobileSidebarOpen(false)}
        open={isMobileSidebarOpen}
        width={"100%"} // ✅ Điều chỉnh chiều rộng cho phù hợp
      >
        {/* 🔥 Thêm nút đóng ở góc phải */}
        <div className="flex justify-end items-center py-2  bg-white shadow-sm relative">
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-gray-600 hover:text-red-500 transition-all duration-200 text-4xl bg-transparent border-none outline-none focus:outline-none"
          >
            ✖
          </button>
        </div>

        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </Drawer>

      {/* Main Layout */}
      <Layout className="w-full">
        {/* Header */}
        <Header className="flex items-center justify-between bg-white px-4 shadow-md md:px-6">
          {/* Nút mở menu trên Mobile */}
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-xl w-10 h-10 lg:hidden"
          />
          <HeaderAdminRight />
        </Header>

        {/* Nội dung chính */}
        <Content className="m-4 p-4 bg-gray-100 min-h-[80vh] rounded-md shadow-md">
          {/* Ẩn Breadcrumb trên mobile để tiết kiệm không gian */}
          <div className="breadcrumb-container hidden md:block">
            <Bread path={location.pathname} />
          </div>

          <div>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <LayoutPageDefault>{children}</LayoutPageDefault>
            )}
          </div>
        </Content>

        {/* Nút cuộn lên đầu trang */}
        {showScrollButton && (
          <FloatButton
            icon={<ArrowUpOutlined />}
            style={{
              right: 24,
              bottom: 80,
              transition: "opacity 0.3s",
            }}
            onClick={scrollToTopSlow}
          />
        )}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
