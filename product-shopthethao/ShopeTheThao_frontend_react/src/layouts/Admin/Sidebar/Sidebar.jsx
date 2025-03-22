import React, { useState, useEffect } from "react";
import { Menu, Divider } from "antd";
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
      [`${ADMIN_PREFIX}/portal`]: "grDashboard",
      
      [`${ADMIN_PREFIX}/catalog/products`]: "grProductManagement",
      [`${ADMIN_PREFIX}/inventory/sizes`]: "grProductManagement",
      [`${ADMIN_PREFIX}/catalog/categories`]: "grProductManagement",
      [`${ADMIN_PREFIX}/catalog/product-attributes`]: "grProductManagement",

      [`${ADMIN_PREFIX}/inventory/suppliers`]: "grInventoryManagement",
      [`${ADMIN_PREFIX}/inventory/brands`]: "grInventoryManagement",
      [`${ADMIN_PREFIX}/inventory/stock-receipts`]: "grInventoryManagement",

      [`${ADMIN_PREFIX}/invoices`]: "grSalesManagement",
      [`${ADMIN_PREFIX}/invoices/detailed`]: "grSalesManagement",

      [`${ADMIN_PREFIX}/users/accounts`]: "grUserManagement",
      [`${ADMIN_PREFIX}/users/staff`]: "grUserManagement",
      [`${ADMIN_PREFIX}/users/roles`]: "grUserManagement",

      [`${ADMIN_PREFIX}/charts`]: "grReportsAnalytics",
      [`${ADMIN_PREFIX}/verification`]: "grReportsAnalytics",
      [`${ADMIN_PREFIX}/users/history`]: "grReportsAnalytics",
      [`${ADMIN_PREFIX}/statistics-documents`]: "grReportsAnalytics",
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
    // Dashboard Section
    getItem(
      <Link to={`${ADMIN_PREFIX}/portal`} onClick={onClose}>
        <span className="menu-label">Bảng Điều Khiển</span>
      </Link>,
      `${ADMIN_PREFIX}/portal`,
      <HomeFilled className="menu-icon dashboard-icon" />
    ),
    
    { type: 'divider', className: styles.menuDivider },

    // Product Management Section
    getItem(
      <span className="menu-section-title">QUẢN LÝ SẢN PHẨM</span>,
      "grProductManagement",
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
            <span className="menu-item-label">Phân loại sản phẩm</span>
          </Link>,
          `${ADMIN_PREFIX}/catalog/categories`,
          <FontAwesomeIcon
            icon={solidIcons.faLayerGroup}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/catalog/product-attributes`} onClick={onClose}>
            <span className="menu-item-label">Thuộc tính sản phẩm</span>
          </Link>,
          `${ADMIN_PREFIX}/catalog/product-attributes`,
          <FontAwesomeIcon
            icon={solidIcons.faListAlt}
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

    // Inventory Management Section
    getItem(
      <span className="menu-section-title">QUẢN LÝ KHO HÀNG</span>,
      "grInventoryManagement",
      <FontAwesomeIcon
        icon={solidIcons.faWarehouse}
        className="menu-icon inventory-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/inventory/suppliers`} onClick={onClose}>
            <span className="menu-item-label">Nhà cung cấp</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/suppliers`,
          <FontAwesomeIcon
            icon={solidIcons.faHandshake}
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
            <span className="menu-item-label">Phiếu nhập kho</span>
          </Link>,
          `${ADMIN_PREFIX}/inventory/stock-receipts`,
          <FontAwesomeIcon
            icon={solidIcons.faClipboardList}
            className="submenu-icon"
          />
        ),
      ]
    ),

    { type: 'divider', className: styles.menuDivider },

    // Sales Management Section
    getItem(
      <span className="menu-section-title">QUẢN LÝ BÁN HÀNG</span>,
      "grSalesManagement",
      <FontAwesomeIcon
        icon={solidIcons.faShoppingCart}
        className="menu-icon sales-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/invoices`} onClick={onClose}>
            <span className="menu-item-label">Hóa đơn bán hàng</span>
          </Link>,
          `${ADMIN_PREFIX}/invoices`,
          <FontAwesomeIcon
            icon={solidIcons.faFileInvoiceDollar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/invoices/detailed`} onClick={onClose}>
            <span className="menu-item-label">Chi tiết đơn hàng</span>
          </Link>,
          `${ADMIN_PREFIX}/invoices/detailed`,
          <FontAwesomeIcon
            icon={solidIcons.faReceipt}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // User Management Section
    getItem(
      <span className="menu-section-title">QUẢN LÝ NGƯỜI DÙNG</span>,
      "grUserManagement",
      <FontAwesomeIcon
        icon={solidIcons.faUsersCog}
        className="menu-icon user-icon"
      />,
      [
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/roles`} onClick={onClose}>
            <span className="menu-item-label">Vai trò & Phân quyền</span>
          </Link>,
          `${ADMIN_PREFIX}/users/roles`,
          <FontAwesomeIcon
            icon={solidIcons.faUserShield}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/staff`} onClick={onClose}>
            <span className="menu-item-label">Quản lý nhân viên</span>
          </Link>,
          `${ADMIN_PREFIX}/users/staff`,
          <FontAwesomeIcon
            icon={solidIcons.faUserTie}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/accounts`} onClick={onClose}>
            <span className="menu-item-label">Tài khoản khách hàng</span>
          </Link>,
          `${ADMIN_PREFIX}/users/accounts`,
          <FontAwesomeIcon
            icon={solidIcons.faUserFriends}
            className="submenu-icon"
          />
        ),
      ]
    ),

    { type: 'divider', className: styles.menuDivider },

    // Reports & Analytics Section
    getItem(
      <span className="menu-section-title">BÁO CÁO & THỐNG KÊ</span>,
      "grReportsAnalytics",
      <FontAwesomeIcon
        icon={solidIcons.faChartLine}
        className="menu-icon report-icon"
      />,
      [
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
        getItem(
          <Link to={`${ADMIN_PREFIX}/statistics-documents`} onClick={onClose}>
            <span className="menu-item-label">Báo cáo doanh thu</span>
          </Link>,
          `${ADMIN_PREFIX}/statistics-documents`,
          <FontAwesomeIcon
            icon={solidIcons.faFileLines}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/verification`} onClick={onClose}>
            <span className="menu-item-label">Thống kê người dùng</span>
          </Link>,
          `${ADMIN_PREFIX}/verification`,
          <FontAwesomeIcon
            icon={solidIcons.faChartBar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={`${ADMIN_PREFIX}/users/history`} onClick={onClose}>
            <span className="menu-item-label">Lịch sử hoạt động</span>
          </Link>,
          `${ADMIN_PREFIX}/users/history`,
          <FontAwesomeIcon
            icon={solidIcons.faHistory}
            className="submenu-icon"
          />
        ),
      ]
    ),
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>SHOPE THỂ THAO</h2>
        <p className={styles.sidebarSubtitle}>Hệ thống quản lý</p>
      </div>
      <Menu
        className={styles["sidebar-menu"]}
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

export default Sidebar;
