import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Snowfall from "./Snowfall/Snowfall";
import "./User.module.scss"; // Import as global stylesheet
import { Products } from "pages/User";
import { Slideshow } from "components/User";


const UserLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isProductsPage = location.pathname.includes("/products");
  const isProductDetailsPage = location.pathname.includes("/seefulldetails");
  const isHomePage = location.pathname === "/";

  return (
    <div className={`layout-container ${isProductsPage ? 'products-view' : ''} ${isHomePage ? 'home-view' : ''} ${isProductDetailsPage ? 'product-details-view' : ''}`}>
      <Snowfall />
      {!isLoginPage && <Header className="layout-header" />}
      <div className="layout-wrapper">
        <main className={`layout-main ${isProductsPage ? 'products-main' : ''} ${isProductDetailsPage ? 'product-details-main' : ''}`}>
          <div className="content-wrapper">
            {/* Remove BreadcrumbUser from here as we'll add it to each page */}
            {isHomePage && <Slideshow/>}
            {!isProductsPage && !isProductDetailsPage && isHomePage && <Products />}
            <Outlet />
          </div>
        </main>
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default UserLayout;
