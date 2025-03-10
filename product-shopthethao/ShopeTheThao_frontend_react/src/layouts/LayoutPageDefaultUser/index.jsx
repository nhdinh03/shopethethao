import { Card } from 'antd';
import './LayoutPageDefaultUser.scss';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import Header from '../User/Header';
import Footer from '../User/Footer';

function LayoutPageDefaultUser({ children, path = '' }) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    // Show header and footer on all pages except login-related paths
    const shouldShowHeaderFooter = !location.pathname.includes('/login') && 
                                  !location.pathname.includes('/register') && 
                                  !location.pathname.includes('/forgotpassword') &&
                                  !location.pathname.includes('/otp') &&
                                  !location.pathname.includes('/changepassword');

    return (
        <div className="layout-wrapper">
            {shouldShowHeaderFooter && <Header />}
            
            <main className={classNames('main-content', { 
                'with-header-footer': shouldShowHeaderFooter,
                'home-page': isHomePage,
                'product-page': location.pathname.includes('/products'),
                'product-detail-page': location.pathname.includes('/seefulldetails')
            })}>
                {isHomePage ? (
                    <>{children}</>
                ) : (
                    <Card 
                        bordered={false} 
                        className={classNames('card-content-page', {
                            'product-detail-card': location.pathname.includes('/seefulldetails')
                        })}
                    >
                        {children}
                    </Card>
                )}
            </main>

            {shouldShowHeaderFooter && <Footer />}
        </div>
    );
}

export default LayoutPageDefaultUser;
