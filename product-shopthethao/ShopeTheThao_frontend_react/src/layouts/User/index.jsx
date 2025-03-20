import React, { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Snowfall from "./Snowfall/Snowfall";
import BackToTop from "components/BackToTop";
import FeedbackModal from "components/FeedbackModal";
import "./User.module.scss"; // Import as global stylesheet
import { HomeIndex } from "pages/User";

const UserLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State to track mobile menu
  const isLoginPage = location.pathname === "/login";
  const isProductsPage = location.pathname.includes("/products");
  const isProductDetailsPage = location.pathname.includes("/seefulldetails");
  const isHomePage = location.pathname === "/";

  return (
    <div
      className={`layout-container ${isProductsPage ? "products-view" : ""} ${
        isHomePage ? "home-view" : ""
      } ${isProductDetailsPage ? "product-details-view" : ""}`}
    >
      <Snowfall />
      {!isLoginPage && (
        <Header
          className="layout-header"
          onMobileMenuToggle={(isOpen) => setMobileMenuOpen(isOpen)} // Pass callback to track menu state
        />
      )}
      {/* Only render HomeIndex on the home page */}
      {isHomePage && <HomeIndex />}
      <div className="layout-wrapper">
        <main
          className={`layout-main ${
            isProductsPage ? "products-main" : ""
          } ${isProductDetailsPage ? "product-details-main" : ""}`}
        >
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
      {!isLoginPage && (
        <>
          <Footer />
          <BackToTop />
          {/* Only render FeedbackModal when mobile menu is not open */}
          {isHomePage && !mobileMenuOpen && <FeedbackModal />}
        </>
      )}
    </div>
  );
};

export default UserLayout;
