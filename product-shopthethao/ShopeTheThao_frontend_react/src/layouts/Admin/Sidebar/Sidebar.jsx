import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { HomeFilled } from "@ant-design/icons";

const ADMIN_PREFIX = '/dashboard-management-sys';

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

function Sidebar({ onClose }) {
  const location = useLocation();
  const selectedKey = location.pathname;

  // Cập nhật mapping với đường dẫn mới
  const findParentKey = (key) => {
    const parentMap = {
      [`${ADMIN_PREFIX}/portal`]: "grHome",
      
      [`${ADMIN_PREFIX}/catalog/products`]: "grProducts",
      [`${ADMIN_PREFIX}/inventory/sizes`]: "grProducts",
      [`${ADMIN_PREFIX}/catalog/categories`]: "grProducts",

      [`${ADMIN_PREFIX}/inventory/suppliers`]: "grSuppliers",
      [`${ADMIN_PREFIX}/inventory/brands`]: "grSuppliers",
      [`${ADMIN_PREFIX}/inventory/stock-receipts`]: "grSuppliers",

      [`${ADMIN_PREFIX}/invoices`]: "grInvoices",
      [`${ADMIN_PREFIX}/invoices/detailed`]: "grInvoices",

      [`${ADMIN_PREFIX}/users/accounts`]: "grAccounts",
      [`${ADMIN_PREFIX}/users/staff`]: "grAccounts",
      [`${ADMIN_PREFIX}/users/roles`]: "grAccounts",

      [`${ADMIN_PREFIX}/catalog/product-attributes`]: "grDistinctives",

      [`${ADMIN_PREFIX}/charts`]: "grStatistics",
      [`${ADMIN_PREFIX}/verification`]: "grStatistics",
      [`${ADMIN_PREFIX}/users/history`]: "grStatistics",
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
      <Link to={`${ADMIN_PREFIX}/portal`} onClick={onClose}>
        <span className="menu-label">Trang chủ</span>
      </Link>,
      `${ADMIN_PREFIX}/portal`,
      <HomeFilled className="menu-icon dashboard-icon" />
    ),

    // Catalog Management
    getItem(
      <span className="menu-group">Quản Lý Sản Phẩm</span>,
      "grProducts",
      <FontAwesomeIcon
        icon={solidIcons.faBoxOpen}
        className="menu-icon product-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/catalog/products`} onClick={onClose}>
            <span className="menu-item-label">Danh sách sản phẩm</span>
          </Link>,
          `${ADMIN_PREFIX}/catalog/products`,
          <FontAwesomeIcon icon={solidIcons.faList} className="submenu-icon" />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/catalog/categories`} onClick={onClose}>
            <span className="menu-item-label">Phân loại</span>
          </Link>,
          `${ADMIN_PREFIX}/catalog/categories`,
          <FontAwesomeIcon
            icon={solidIcons.faLayerGroup}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/inventory/sizes`} onClick={onClose}>
            <span className="menu-item-label">Kích thước</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/sizes`,
          <FontAwesomeIcon icon={solidIcons.faRuler} className="submenu-icon" />
        ),
      ]
    ),

    // Product Features
    getItem(
      <span className="menu-group">Đặc Trưng Sản Phẩm</span>,
      "grDistinctives",
      <FontAwesomeIcon
        icon={solidIcons.faTags}
        className="menu-icon feature-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/catalog/product-attributes`} onClick={onClose}>
            <span className="menu-item-label">Thuộc tính</span>
          </Link>,
          `${ADMIN_PREFIX}/catalog/product-attributes`,
          <FontAwesomeIcon
            icon={solidIcons.faListAlt}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // Supplier Management
    getItem(
      <span className="menu-group">Quản Lý Nhà Cung Cấp</span>,
      "grSuppliers",
      <FontAwesomeIcon
        icon={solidIcons.faHandshake}
        className="menu-icon supplier-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/inventory/suppliers`} onClick={onClose}>
            <span className="menu-item-label">Danh sách nhà cung cấp</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/suppliers`,
          <FontAwesomeIcon
            icon={solidIcons.faBuilding}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/inventory/brands`} onClick={onClose}>
            <span className="menu-item-label">Thương hiệu</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/brands`,
          <FontAwesomeIcon
            icon={solidIcons.faTrademark}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/inventory/stock-receipts`} onClick={onClose}>
            <span className="menu-item-label">Nhập kho</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/stock-receipts`,
          <FontAwesomeIcon
            icon={solidIcons.faClipboardList}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // Sales Management
    getItem(
      <span className="menu-group">Quản Lý Bán Hàng</span>,
      "grInvoices",
      <FontAwesomeIcon
        icon={solidIcons.faShoppingCart}
        className="menu-icon sales-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/invoices`} onClick={onClose}>
            <span className="menu-item-label">Hóa đơn bán</span>
          </Link>,
          `${ADMIN_PREFIX}/invoices`,
          <FontAwesomeIcon
            icon={solidIcons.faFileInvoiceDollar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/invoices/detailed`} onClick={onClose}>
            <span className="menu-item-label">Chi tiết bán hàng</span>
          </Link>,
          `${ADMIN_PREFIX}/invoices/detailed`,
          <FontAwesomeIcon
            icon={solidIcons.faReceipt}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // User Management
    getItem(
      <span className="menu-group">Quản Lý Tài Khoản</span>,
      "grAccounts",
      <FontAwesomeIcon
        icon={solidIcons.faUsers}
        className="menu-icon user-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/roles`} onClick={onClose}>
            <span className="menu-item-label">Phân quyền</span>
          </Link>,
          `${ADMIN_PREFIX}/users/roles`,
          <FontAwesomeIcon
            icon={solidIcons.faUserShield}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/staff`} onClick={onClose}>
            <span className="menu-item-label">Nhân viên</span>
          </Link>,
          `${ADMIN_PREFIX}/users/staff`,
          <FontAwesomeIcon
            icon={solidIcons.faUserTie}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/accounts`} onClick={onClose}>
            <span className="menu-item-label">Khách hàng</span>
          </Link>,
          `${ADMIN_PREFIX}/users/accounts`,
          <FontAwesomeIcon
            icon={solidIcons.faUserFriends}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // Reports & Analytics
    getItem(
      <span className="menu-group">Thống Kê & Báo Cáo</span>,
      "grStatistics",
      <FontAwesomeIcon
        icon={solidIcons.faChartLine}
        className="menu-icon report-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/history`} onClick={onClose}>
            <span className="menu-item-label">Phân tích hoạt động</span>
          </Link>,
          `${ADMIN_PREFIX}/users/history`,
          <FontAwesomeIcon
            icon={solidIcons.faUserClock}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/verification`} onClick={onClose}>
            <span className="menu-item-label">Thống kê tài khoản</span>
          </Link>,
          `${ADMIN_PREFIX}/verification`,
          <FontAwesomeIcon
            icon={solidIcons.faChartBar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/statistics-documents`} onClick={onClose}>
            <span className="menu-item-label">Báo cáo thống kê</span>
          </Link>,
          `${ADMIN_PREFIX}/statistics-documents`,
          <FontAwesomeIcon
            icon={solidIcons.faFileLines}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/charts`} onClick={onClose}>
            <span className="menu-item-label">Biểu đồ phân tích</span>
          </Link>,
          `${ADMIN_PREFIX}/charts`,
          <FontAwesomeIcon
            icon={solidIcons.faChartPie}
            className="submenu-icon"
          />
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
