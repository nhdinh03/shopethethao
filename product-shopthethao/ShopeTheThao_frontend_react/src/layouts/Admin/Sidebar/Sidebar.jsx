import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { HomeFilled, FileTextOutlined } from "@ant-design/icons";

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

function Sidebar({ onClose }) {
  const location = useLocation();
  const selectedKey = location.pathname;

  // Xác định menu cha cần mở
  const findParentKey = (key) => {
    const parentMap = {
      "/admin/index": "grHome", // Trang chủ

      "/admin/product": "grProducts", // Sản phẩm
      "/admin/sizes": "grProducts", // Nhãn hàng
      "/admin/categories": "grProducts", // Danh mục sản phẩm
      // "/admin/productsizes": "grProducts", // Nhãn hàng


      "/admin/suppliers": "grSuppliers", // Nhà cung cấp
      "/admin/brands": "grSuppliers", // Nhãn hàng
      "/admin/stock-receipts": "grSuppliers", // Phiếu nhập kho

      "/admin/invoices": "grInvoices", // Hóa đơn
      "/admin/detailed-invoices": "grInvoices", // Chi tiết hóa đơn

      "/admin/account": "grAccounts", // Người dùng
      "/admin/accountStaff": "grAccounts", // Nhân viên
      "/admin/roles": "grAccounts", //role

      "/admin/products-distinctives": "grDistinctives", // Thuộc tính sản phẩm

      "/admin/statistics-documents": "grStatistics", // Tài liệu thống kê
      "/admin/charts": "grStatistics", // Biểu đồ thống kê
      "/admin/verification": "grStatistics", // Biểu đồ thống kê
    };
    return parentMap[key];
  };

  // Quản lý state openKeys
  const [openKeys, setOpenKeys] = useState([]);

  // Thiết lập openKeys khi tải lại trang
  useEffect(() => {
    const parentKey = findParentKey(selectedKey);
    if (parentKey) {
      setOpenKeys([parentKey]);
    }
  }, [selectedKey]);

  // Xử lý mở hoặc đóng menu cha
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const items = [
    // Trang chủ
    getItem(
      <Link to="/admin/index" onClick={onClose}>
        Trang chủ
      </Link>,
      "/admin/index",
      <HomeFilled style={{ fontSize: "18px", color: "#4CAF50" }} />
    ),

    // Quản lý sản phẩm
    getItem(
      "Quản Lý Sản Phẩm",
      "grProducts",
      <FontAwesomeIcon icon={solidIcons.faBox} style={{ color: "#00BCD4" }} />,
      [
        getItem(
          <Link to="/admin/product" onClick={onClose}>
            Sản phẩm
          </Link>,
          "/admin/product"
        ),
        getItem(
          <Link to="/admin/categories" onClick={onClose}>
            Danh mục
          </Link>,
          "/admin/categories"
        ),
        getItem(
          <Link to="/admin/sizes" onClick={onClose}>
            Kích thước
          </Link>,
          "/admin/sizes"
        ),
        // getItem(
        //   <Link to="/admin/productsizes" onClick={onClose}>
        //     Danh sách
        //   </Link>,
        //   "/admin/productsizes"
        // ),

    
      ]
    ),

    // Nhà cung cấp
    getItem(
      "Quản Lý Nhà Cung Cấp",
      "grSuppliers",
      <FontAwesomeIcon
        icon={solidIcons.faTruck}
        style={{ color: "#FF5722" }}
      />,
      [
        getItem(
          <Link to="/admin/suppliers" onClick={onClose}>
            Nhà cung cấp
          </Link>,
          "/admin/suppliers"
        ),
        getItem(
          <Link to="/admin/brands" onClick={onClose}>
            Thương hiệu
          </Link>,
          "/admin/brands"
        ),
        getItem(
          <Link to="/admin/stock-receipts" onClick={onClose}>
            Phiếu nhập kho
          </Link>,
          "/admin/stock-receipts"
        ),
      ]
    ),

    // Quản lý bán hàng
    getItem(
      "Quản Lý Bán Hàng",
      "grInvoices",
      <FontAwesomeIcon
        icon={solidIcons.faFileInvoice}
        style={{ color: "#FF9800" }}
      />,
      [
        getItem(
          <Link to="/admin/invoices" onClick={onClose}>
            Hóa đơn
          </Link>,
          "/admin/invoices"
        ),
        getItem(
          <Link to="/admin/detailed-invoices" onClick={onClose}>
            Chi tiết hóa đơn
          </Link>,
          "/admin/detailed-invoices"
        ),
      ]
    ),

    // Quản lý người dùng
    getItem(
      "Quản Lý Tài khoản",
      "grAccounts",
      <FontAwesomeIcon icon={solidIcons.faUser} style={{ color: "#3F51B5" }} />,
      [
        getItem(
          <Link to="/admin/roles" onClick={onClose}>
            Vai trò
          </Link>,
          "/admin/roles"
        ),
        getItem(
          <Link to="/admin/account" onClick={onClose}>
            Người dùng
          </Link>,
          "/admin/account"
        ),

        getItem(
          <Link to="/admin/accountStaff" onClick={onClose}>
            Nhân viên
          </Link>,
          "/admin/accountStaff"
        ),
      ]
    ),

    // Đặc trưng sản phẩm
    getItem(
      "Đặc Trưng Sản Phẩm",
      "grDistinctives",
      <FontAwesomeIcon icon={solidIcons.faStar} style={{ color: "#FFC107" }} />,
      [
        getItem(
          <Link to="/admin/products-distinctives" onClick={onClose}>
            Thuộc tính sản phẩm
          </Link>,
          "/admin/products-distinctives"
        ),
      ]
    ),

    // Thống kê & Báo cáo
    getItem(
      "Thống Kê & Báo Cáo",
      "grStatistics",
      <FileTextOutlined style={{ color: "#607D8B" }} />,
      [
        getItem(
          <Link to="/admin/verification" onClick={onClose}>
            Thông kê tài khoản
          </Link>,
          "/admin/verification"
        ),
        getItem(
          <Link to="/admin/statistics-documents" onClick={onClose}>
            Tài liệu thống kê
          </Link>,
          "/admin/statistics-documents"
        ),

        getItem(
          <Link to="/admin/charts" onClick={onClose}>
            Biểu đồ thống kê
          </Link>,
          "/admin/charts"
        ),
      ]
    ),
  ];

  return (
    <div className={styles.sidebar}>
      <Menu
        className={styles["sidebar-menu"]}
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]} // Highlight menu hiện tại
        openKeys={openKeys} // Mở menu cha
        onOpenChange={onOpenChange} // Xử lý mở/đóng menu cha
      />
    </div>
  );
}

export default Sidebar;
