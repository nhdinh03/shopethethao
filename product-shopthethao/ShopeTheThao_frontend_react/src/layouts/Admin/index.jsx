import { useEffect, useState } from "react";
import styles from "./Admin.module.scss";
import "./AdminCustomAntDesgin.scss";
import classNames from "classnames/bind";
import { MenuUnfoldOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Skeleton, Drawer, FloatButton } from "antd";
import { HeaderAdminLeft, HeaderAdminRight } from "./Header";
import { Footer } from "antd/es/layout/layout";
import Sidebar from "./Sidebar/Sidebar";
import { LayoutPageDefault } from "..";
import FooterAdmin from "./Footer/FooterAdmin";
import { useLocation } from "react-router-dom";
import Bread from "./Breadcrumb/Breadcrumb";
import { useDarkMode } from "..//..//config/DarkModeProvider";

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // 🔥 State kiểm soát Sidebar mobile
  const [showScrollButton, setShowScrollButton] = useState(false); // 🔥 State kiểm soát nút cuộn lên đầu trang
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTopSlow = () => {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const path = window.location.pathname;

  return (
    <Layout className={`flex min-h-screen ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Sidebar - Desktop */}
      <Sider
        trigger={null}
        theme="light"
        collapsible
        collapsed={collapsed}
        width={290}
        className="hidden md:block"
      >
        <Header className="flex items-center bg-white px-4">
          <HeaderAdminLeft />
        </Header>
        <Sidebar />
      </Sider>

      {/* Sidebar - Mobile (Drawer) */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setIsMobileSidebarOpen(false)}
        open={isMobileSidebarOpen}
        className="block md:hidden"
        width={250}
      >
        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </Drawer>

      {/* Layout chính */}
      <Layout className="w-full">
        {/* Header - Hiển thị trên cả mobile & desktop */}
        <Header className="flex items-center justify-between bg-white px-4 shadow-md md:px-6">
          {/* Nút mở menu trên Mobile */}
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setIsMobileSidebarOpen(true)} // 🔥 Mở Sidebar Mobile
            className="text-xl w-12 h-12 md:hidden"
          />

          <HeaderAdminRight />
        </Header>

        {/* Nội dung chính */}
        <Content className="m-6 p-6 bg-gray-100 min-h-[80vh] rounded-md shadow-md">
          <div className="breadcrumb-container">
            <Bread path={location.pathname} />
          </div>

          <div>
            {isLoading && <Skeleton active={active} />}
            {!isLoading && (
              <LayoutPageDefault path={path}>{children}</LayoutPageDefault>
            )}
          </div>
        </Content>

        {/* Nút trở lại đầu trang */}
        {showScrollButton && (
          <FloatButton
            icon={<ArrowUpOutlined />}
            style={{
              right: 24,
              bottom: 80,
              opacity: showScrollButton ? 1 : 0,
              transition: "opacity 0.3s",
            }}
            onClick={scrollToTopSlow}
          />
        )}

        {/* Footer */}
        <Footer>
          <FooterAdmin />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
