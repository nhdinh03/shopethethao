import { useEffect, useState } from 'react';

// Scss
import styles from './Admin.module.scss';
import './AdminCustomAntDesgin.scss';
import classNames from 'classnames/bind';

// Ant Design
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme, Skeleton, Drawer } from 'antd';
import { HeaderAdminLeft, HeaderAdminRight } from './Header';
import { Footer } from 'antd/es/layout/layout';
import Sidebar from './Sidebar/Sidebar';
import { LayoutPageDefault } from '..';

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [active, setActive] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // 🔥 State kiểm soát Sidebar mobile

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const path = window.location.pathname;

    return (
        <Layout className="flex min-h-screen">
            {/* Sidebar - Desktop */}
            <Sider
                trigger={null}
                theme="light"
                collapsible
                collapsed={collapsed}
                width={250}
                className="hidden md:block" // 🔥 Chỉ hiển thị trên màn hình lớn
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
                className="block md:hidden" // 🔥 Chỉ hiển thị trên điện thoại
                width={250}
            >
                <Sidebar />
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
                    <div>
                        {isLoading && <Skeleton active={active} />}
                        {!isLoading && <LayoutPageDefault path={path}>{children}</LayoutPageDefault>}
                    </div>
                </Content>

                {/* Footer */}
                <Footer className="text-center bg-white py-4 shadow-inner">
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
