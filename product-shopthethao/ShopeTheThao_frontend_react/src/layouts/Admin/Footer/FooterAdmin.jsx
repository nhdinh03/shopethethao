import { Layout, Space, Typography } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const FooterAdmin = () => {
    return (
        <Footer style={{ background: '#001529', color: '#fff', textAlign: 'center', padding: '20px 50px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                {/* Logo and Name */}
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                    <span style={{ color: '#1890ff' }}>Shop Đỉnh Cao</span> - Thời trang thể thao hàng đầu
                </div>

                {/* Quick Links */}
                <div>
                    <Space size="large">
                        <Link href="/about" style={{ color: '#fff' }}>Giới thiệu</Link>
                        <Link href="/products" style={{ color: '#fff' }}>Sản phẩm</Link>
                        <Link href="/contact" style={{ color: '#fff' }}>Liên hệ</Link>
                        <Link href="/terms" style={{ color: '#fff' }}>Điều khoản</Link>
                    </Space>
                </div>

                {/* Social Media */}
                <div style={{ margin: '15px 0' }}>
                    <Space size="large">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FacebookOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <TwitterOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <InstagramOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        </a>
                    </Space>
                </div>

                {/* Copyright */}
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    ©2025 Shop Đỉnh Cao. Được phát triển bởi <Link href="https://devportfolio.com" style={{ color: '#1890ff' }}>DevTeam</Link>
                </Text>
            </Space>
        </Footer>
    );
};

export default FooterAdmin;