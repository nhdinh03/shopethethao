import React from "react";
import { Breadcrumb } from "antd";
import "./Breadcrumb.scss";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const breadcrumbData = [
  { url: "/admin/index", title: "Trang chủ" },
  { url: "/admin/product", title: "Sản phẩm" },
  { url: "/admin/sizes", title: "Quản Lý Size" },
  { url: "/admin/categories", title: "Danh mục sản phẩm" },
  // { url: "/admin/productsizes", title: "Quản Lý Size" },
  { url: "/admin/brands", title: "Nhãn hàng" },
  { url: "/admin/suppliers", title: "Nhà cung cấp" },
  { url: "/admin/stock-receipts", title: "Phiếu nhập kho" },
  { url: "/admin/invoices", title: "Hóa đơn" },
  { url: "/admin/detailed-invoices", title: "Chi tiết hóa đơn" },
  { url: "/admin/account", title: "Người dùng" },
  { url: "/admin/accountStaff", title: "Nhân viên" },
  { url: "/admin/roles", title: "vai trò" },
  { url: "/admin/products-distinctives", title: "Thuộc tính sản phẩm" },
  { url: "/admin/statistics-documents", title: "Tài liệu thống kê" },
  { url: "/admin/charts", title: "Biểu đồ thống kê" },
  { url: "/admin/verification", title: "Thống kê Tài khoản" },
];

const Bread = ({ path }) => {
  const matchingItem = breadcrumbData.find((item) => path.endsWith(item.url));

  const breadcrumbItems = [
    {
      title: (
        <span>
          <div className="breadcrumb-icon">
            <Link
              to="/admin/index"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <HomeOutlined />
              Admin
            </Link>
          </div>
        </span>
      ),
    },
  ];

  if (matchingItem) {
    breadcrumbItems.push({
      title: <span>{matchingItem.title}</span>,
    });
  }

  return <Breadcrumb items={breadcrumbItems} />;
};

export default Bread;
