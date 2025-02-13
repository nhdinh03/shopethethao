// UserLayout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Snowfall from "./Snowfall/Snowfall";


const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Snowfall />
      <Header />

      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;
