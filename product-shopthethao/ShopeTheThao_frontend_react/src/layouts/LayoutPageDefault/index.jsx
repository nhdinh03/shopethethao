import { Card } from 'antd';
import style from './LayoutPageDefault.module.scss';
import classNames from 'classnames/bind';
import Bread from 'layouts/Breadcrumb/Breadcrumb';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(style);

function LayoutPageDefault({ children, path = '' }) {
      const location = useLocation();
      const isHomePage = location.pathname === '/admin/index'; 
    return (
        <>
            <Card bordered={false} className={cx('card-Breadcrumb')}>
                <Bread path={path} />
            </Card>

            {isHomePage ? (
                // Ẩn Card nếu là trang chủ
                <>{children}</>
            ) : (
                // Hiển thị Card nếu không phải trang chủ
                <Card bordered={false} className={cx('card-content-page')}>
                    {children}
                </Card>
            )}
        </>
    );
}

export default LayoutPageDefault;
