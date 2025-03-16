import { Card } from 'antd';
import './LayoutPageDefaultUser.scss';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../User/Header';
import Footer from '../User/Footer';
import BreadcrumbUser from 'layouts/User/BreadcrumbUser/BreadcrumbUser';

function LayoutPageDefaultUser({ children }) {
    const location = useLocation();
    const [isAnimating, setIsAnimating] = useState(true);
    
    const isAuthPage = ['/login', '/register', '/forgotpassword', '/otp', '/changepassword']
                        .some(path => location.pathname.includes(path));
    
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="layout-wrapper">
            {!isAuthPage && <Header />}
            {!isAuthPage && <BreadcrumbUser path={location?.pathname || ""} />}
            <main className={classNames('main-content', { 
                'with-header-footer': !isAuthPage,
                'product-page': location.pathname.includes('/products'),
                'product-detail-page': location.pathname.includes('/seefulldetails'),
                'animate-in': isAnimating
            })}>
                <Card 
                    bordered={false} 
                    className={classNames('card-content-page', {
                        'product-detail-card': location.pathname.includes('/seefulldetails'),
                        'has-interaction': true
                    })}
                >
                    {children}
                </Card>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
}

export default LayoutPageDefaultUser;
