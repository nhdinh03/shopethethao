import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { HomeFilled } from "@ant-design/icons";
import { ADMIN_ROUTES } from "../../../constants/routeConstants";

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

function Sidebar({ onClose }) {
  const location = useLocation();
  const selectedKey = location.pathname;

  // Updated parent mapping using ADMIN_ROUTES
  const findParentKey = (key) => {
    const parentMap = {
      [ADMIN_ROUTES.PORTAL]: "grDashboard",

      [ADMIN_ROUTES.CATALOG.PRODUCTS]: "grProductManagement",
      [ADMIN_ROUTES.INVENTORY.SIZES]: "grProductManagement",
      [ADMIN_ROUTES.CATALOG.CATEGORIES]: "grProductManagement",
      [ADMIN_ROUTES.CATALOG.ATTRIBUTES]: "grProductManagement",

      [ADMIN_ROUTES.INVENTORY.SUPPLIERS]: "grInventoryManagement",
      [ADMIN_ROUTES.INVENTORY.BRANDS]: "grInventoryManagement",
      [ADMIN_ROUTES.INVENTORY.STOCK_RECEIPTS]: "grInventoryManagement",

      [ADMIN_ROUTES.INVOICES.LIST]: "grSalesManagement",
      [ADMIN_ROUTES.INVOICES.DETAILS]: "grSalesManagement",

      [ADMIN_ROUTES.USERS.ACCOUNTS]: "grUserManagement",
      [ADMIN_ROUTES.USERS.STAFF]: "grUserManagement",
      [ADMIN_ROUTES.USERS.ACCOUNTSLOCK]: "grUserManagement",
      [ADMIN_ROUTES.USERS.ROLES]: "grUserManagement",

      [ADMIN_ROUTES.ANALYTICS.CHARTS]: "grReportsAnalytics",
      [ADMIN_ROUTES.ANALYTICS.VERIFICATION]: "grReportsAnalytics",
      [ADMIN_ROUTES.USERS.HISTORY]: "grReportsAnalytics",
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
      <Link to={ADMIN_ROUTES.PORTAL} onClick={onClose}>
        <span className="menu-label">Bảng Điều Khiển</span>
      </Link>,
      ADMIN_ROUTES.PORTAL,
      <HomeFilled className="menu-icon dashboard-icon" />
    ),

    { type: "divider", className: styles.menuDivider },

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
          <Link to={ADMIN_ROUTES.CATALOG.PRODUCTS} onClick={onClose}>
            <span className="menu-item-label">Danh sách sản phẩm</span>
          </Link>,
          ADMIN_ROUTES.CATALOG.PRODUCTS,
          <FontAwesomeIcon icon={solidIcons.faList} className="submenu-icon" />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.CATALOG.CATEGORIES} onClick={onClose}>
            <span className="menu-item-label">Phân loại sản phẩm</span>
          </Link>,
          ADMIN_ROUTES.CATALOG.CATEGORIES,
          <FontAwesomeIcon
            icon={solidIcons.faLayerGroup}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.CATALOG.ATTRIBUTES} onClick={onClose}>
            <span className="menu-item-label">Thuộc tính sản phẩm</span>
          </Link>,
          ADMIN_ROUTES.CATALOG.ATTRIBUTES,
          <FontAwesomeIcon
            icon={solidIcons.faListAlt}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.INVENTORY.SIZES} onClick={onClose}>
            <span className="menu-item-label">Kích thước</span>
          </Link>,
          ADMIN_ROUTES.INVENTORY.SIZES,
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
          <Link to={ADMIN_ROUTES.INVENTORY.SUPPLIERS} onClick={onClose}>
            <span className="menu-item-label">Nhà cung cấp</span>
          </Link>,
          ADMIN_ROUTES.INVENTORY.SUPPLIERS,
          <FontAwesomeIcon
            icon={solidIcons.faHandshake}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.INVENTORY.BRANDS} onClick={onClose}>
            <span className="menu-item-label">Thương hiệu</span>
          </Link>,
          ADMIN_ROUTES.INVENTORY.BRANDS,
          <FontAwesomeIcon
            icon={solidIcons.faTrademark}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.INVENTORY.STOCK_RECEIPTS} onClick={onClose}>
            <span className="menu-item-label">Phiếu nhập kho</span>
          </Link>,
          ADMIN_ROUTES.INVENTORY.STOCK_RECEIPTS,
          <FontAwesomeIcon
            icon={solidIcons.faClipboardList}
            className="submenu-icon"
          />
        ),
      ]
    ),

    { type: "divider", className: styles.menuDivider },

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
          <Link to={ADMIN_ROUTES.INVOICES.LIST} onClick={onClose}>
            <span className="menu-item-label">Hóa đơn bán hàng</span>
          </Link>,
          ADMIN_ROUTES.INVOICES.LIST,
          <FontAwesomeIcon
            icon={solidIcons.faFileInvoiceDollar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.INVOICES.DETAILS} onClick={onClose}>
            <span className="menu-item-label">Chi tiết đơn hàng</span>
          </Link>,
          ADMIN_ROUTES.INVOICES.DETAILS,
          <FontAwesomeIcon
            icon={solidIcons.faReceipt}
            className="submenu-icon"
          />
        ),
      ]
    ),

    // User Management Section
    getItem(
      <span className="menu-section-title">QUẢN LÝ TÀI KHOẢN</span>,
      "grUserManagement",
      <FontAwesomeIcon
        icon={solidIcons.faUsersCog}
        className="menu-icon user-icon"
      />,
      [
        getItem(
          <Link to={ADMIN_ROUTES.USERS.ACCOUNTS} onClick={onClose}>
            <span className="menu-item-label">Tài khoản khách hàng</span>
          </Link>,
          ADMIN_ROUTES.USERS.ACCOUNTS,
          <FontAwesomeIcon
            icon={solidIcons.faUserFriends}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.USERS.STAFF} onClick={onClose}>
            <span className="menu-item-label">Quản lý nhân viên</span>
          </Link>,
          ADMIN_ROUTES.USERS.STAFF,
          <FontAwesomeIcon
            icon={solidIcons.faUserTie}
            className="submenu-icon"
          />
        ),

        getItem(
          <Link to={ADMIN_ROUTES.USERS.ACCOUNTSLOCK} onClick={onClose}>
            <span className="menu-item-label">Quản lý tài khoản bị khóa</span>
          </Link>,
          ADMIN_ROUTES.USERS.ACCOUNTSLOCK,
          <FontAwesomeIcon
            icon={solidIcons.faUserFriends}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.USERS.ROLES} onClick={onClose}>
            <span className="menu-item-label">Vai trò & Phân quyền</span>
          </Link>,
          ADMIN_ROUTES.USERS.ROLES,
          <FontAwesomeIcon
            icon={solidIcons.faUserShield}
            className="submenu-icon"
          />
        ),
      ]
    ),

    { type: "divider", className: styles.menuDivider },

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
          <Link to={ADMIN_ROUTES.ANALYTICS.CHARTS} onClick={onClose}>
            <span className="menu-item-label">Biểu đồ phân tích</span>
          </Link>,
           ADMIN_ROUTES.ANALYTICS.CHARTS,
          <FontAwesomeIcon
            icon={solidIcons.faChartPie}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.ANALYTICS.VERIFICATION} onClick={onClose}>
            <span className="menu-item-label">Thống kê người dùng</span>
          </Link>,
          ADMIN_ROUTES.ANALYTICS.VERIFICATION,
          <FontAwesomeIcon
            icon={solidIcons.faChartBar}
            className="submenu-icon"
          />
        ),
        getItem(
          <Link to={ADMIN_ROUTES.USERS.HISTORY} onClick={onClose}>
            <span className="menu-item-label">Lịch sử hoạt động</span>
          </Link>,
          ADMIN_ROUTES.USERS.HISTORY,
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
