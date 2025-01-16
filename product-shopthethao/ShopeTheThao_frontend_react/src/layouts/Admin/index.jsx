import { useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar/Sidebar';
import HeaderAdminLeft from './Header/HeaderAdminLeft';
import HeaderAdminRight from './Header/HeaderAdminRight';
import FooterAdmin from './Footer/FooterAdmin';
import styles from './Admin.module.scss';
import classNames from 'classnames/bind';

const { Header, Sider, Content, Footer } = Layout;
const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className={cx('admin-layout')}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250} theme="light">
                <Sidebar />
            </Sider>
            <Layout>
                <Header className={cx('header')}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className={cx('toggle-btn')}
                    />
                    <HeaderAdminLeft />
                    <HeaderAdminRight />
                </Header>
                <Content className={cx('content')}>
                    {children}
                </Content>
                <Footer className={cx('footer')}>
                    <FooterAdmin />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
