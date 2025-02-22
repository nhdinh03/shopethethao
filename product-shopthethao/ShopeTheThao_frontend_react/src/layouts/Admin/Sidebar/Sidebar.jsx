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

      "/admin/product-attributes": "grDistinctives", // Thuộc tính sản phẩm

      "/admin/statistics-documents": "grStatistics", // Tài liệu thống kê
      "/admin/charts": "grStatistics", // Biểu đồ thống kê
      "/admin/verification": "grStatistics", // Biểu đồ thống kê

      "/admin/userhistory": "grStatistics", // hoạt động
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
    // Dashboard
    getItem(
      <Link to="/admin/index" onClick={onClose}>
        <span className="menu-label">Trang chủ</span>
      </Link>,
      "/admin/index",
      <HomeFilled className="menu-icon dashboard-icon" />
    ),

    // Catalog Management
    getItem(
      <span className="menu-group">Quản Lý Sản Phẩm</span>,
      "grProducts",
      <FontAwesomeIcon icon={solidIcons.faBoxOpen} className="menu-icon product-icon" />,
      [
        getItem(
          <Link to="/admin/product" onClick={onClose}>
            <span className="menu-item-label">Danh sách sản phẩm</span>
          </Link>,
          "/admin/product",
          <FontAwesomeIcon icon={solidIcons.faList} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/categories" onClick={onClose}>
            <span className="menu-item-label">Phân loại</span>
          </Link>,
          "/admin/categories",
          <FontAwesomeIcon icon={solidIcons.faLayerGroup} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/sizes" onClick={onClose}>
            <span className="menu-item-label">Kích thước</span>
          </Link>,
          "/admin/sizes",
          <FontAwesomeIcon icon={solidIcons.faRuler} className="submenu-icon" />
        ),
      ]
    ),

    // Product Features
    getItem(
      <span className="menu-group">Đặc Trưng Sản Phẩm</span>,
      "grDistinctives",
      <FontAwesomeIcon icon={solidIcons.faTags} className="menu-icon feature-icon" />,
      [
        getItem(
          <Link to="/admin/product-attributes" onClick={onClose}>
            <span className="menu-item-label">Thuộc tính</span>
          </Link>,
          "/admin/product-attributes",
          <FontAwesomeIcon icon={solidIcons.faListAlt} className="submenu-icon" />
        ),
      ]
    ),

    // Supplier Management
    getItem(
      <span className="menu-group">Quản Lý Nhà Cung Cấp</span>,
      "grSuppliers",
      <FontAwesomeIcon icon={solidIcons.faHandshake} className="menu-icon supplier-icon" />,
      [
        getItem(
          <Link to="/admin/suppliers" onClick={onClose}>
            <span className="menu-item-label">Danh sách nhà cung cấp</span>
          </Link>,
          "/admin/suppliers",
          <FontAwesomeIcon icon={solidIcons.faBuilding} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/brands" onClick={onClose}>
            <span className="menu-item-label">Thương hiệu</span>
          </Link>,
          "/admin/brands",
          <FontAwesomeIcon icon={solidIcons.faTrademark} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/stock-receipts" onClick={onClose}>
            <span className="menu-item-label">Nhập kho</span>
          </Link>,
          "/admin/stock-receipts",
          <FontAwesomeIcon icon={solidIcons.faClipboardList} className="submenu-icon" />
        ),
      ]
    ),

    // Sales Management
    getItem(
      <span className="menu-group">Quản Lý Bán Hàng</span>,
      "grInvoices",
      <FontAwesomeIcon icon={solidIcons.faShoppingCart} className="menu-icon sales-icon" />,
      [
        getItem(
          <Link to="/admin/invoices" onClick={onClose}>
            <span className="menu-item-label">Hóa đơn bán</span>
          </Link>,
          "/admin/invoices",
          <FontAwesomeIcon icon={solidIcons.faFileInvoiceDollar} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/detailed-invoices" onClick={onClose}>
            <span className="menu-item-label">Chi tiết bán hàng</span>
          </Link>,
          "/admin/detailed-invoices",
          <FontAwesomeIcon icon={solidIcons.faReceipt} className="submenu-icon" />
        ),
      ]
    ),

    // User Management
    getItem(
      <span className="menu-group">Quản Lý Tài Khoản</span>,
      "grAccounts",
      <FontAwesomeIcon icon={solidIcons.faUsers} className="menu-icon user-icon" />,
      [
        getItem(
          <Link to="/admin/roles" onClick={onClose}>
            <span className="menu-item-label">Phân quyền</span>
          </Link>,
          "/admin/roles",
          <FontAwesomeIcon icon={solidIcons.faUserShield} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/accountStaff" onClick={onClose}>
            <span className="menu-item-label">Nhân viên</span>
          </Link>,
          "/admin/accountStaff",
          <FontAwesomeIcon icon={solidIcons.faUserTie} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/account" onClick={onClose}>
            <span className="menu-item-label">Khách hàng</span>
          </Link>,
          "/admin/account",
          <FontAwesomeIcon icon={solidIcons.faUserFriends} className="submenu-icon" />
        ),
 
      ]
    ),

    // Reports & Analytics
    getItem(
      <span className="menu-group">Thống Kê & Báo Cáo</span>,
      "grStatistics",
      <FontAwesomeIcon icon={solidIcons.faChartLine} className="menu-icon report-icon" />,
      [
        getItem(
          <Link to="/admin/verification" onClick={onClose}>
            <span className="menu-item-label">Thống kê tài khoản</span>
          </Link>,
          "/admin/verification",
          <FontAwesomeIcon icon={solidIcons.faChartBar} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/statistics-documents" onClick={onClose}>
            <span className="menu-item-label">Báo cáo thống kê</span>
          </Link>,
          "/admin/statistics-documents",
          <FontAwesomeIcon icon={solidIcons.faFileLines} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/charts" onClick={onClose}>
            <span className="menu-item-label">Biểu đồ phân tích</span>
          </Link>,
          "/admin/charts",
          <FontAwesomeIcon icon={solidIcons.faChartPie} className="submenu-icon" />
        ),
        getItem(
          <Link to="/admin/userhistory" onClick={onClose}>
            <span className="menu-item-label">Phân thích hoạt động</span>
          </Link>,
          "/admin/userhistory",
          <FontAwesomeIcon icon={solidIcons.faChartPie} className="submenu-icon" />
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
