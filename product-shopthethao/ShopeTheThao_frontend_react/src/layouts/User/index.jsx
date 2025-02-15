import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Snowfall from "./Snowfall/Snowfall";
import Nav from "./Nav";
import "./User.module.scss"

const UserLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="layout-container">
      <Snowfall />
      {!isLoginPage && <Header className="layout-header" />}
      <div className="layout-wrapper">
        {!isLoginPage && <Nav className="layout-nav" />}
        <main className="layout-main">
          <div className="content-wrapper"></div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
