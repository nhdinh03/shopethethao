import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Snowfall from "./Snowfall/Snowfall";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Kiểm tra nếu đường dẫn là /login

  return (
    <div className="min-h-screen flex flex-col">
      <Snowfall />
      
      {!isLoginPage && <Header />}  {/* Ẩn Header khi ở trang /login */}
      
      <main className="flex-grow p-4">{children}</main>
      
      {!isLoginPage && <Footer />}  {/* Ẩn Footer khi ở trang /login */}
    </div>
  );
};

export default UserLayout;
