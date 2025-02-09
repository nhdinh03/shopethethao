import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./User.module.scss"; // Import SCSS để dùng



const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
};


 

export default UserLayout;
