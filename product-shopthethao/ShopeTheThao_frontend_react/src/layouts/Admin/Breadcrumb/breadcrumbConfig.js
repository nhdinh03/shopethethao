const ADMIN_PREFIX = "/dashboard-management-sys";

export const breadcrumbData = [

    
    // Catalog Management
    { url: `${ADMIN_PREFIX}/catalog/products`, title: "Quản lý Sản phẩm" },
    { url: `${ADMIN_PREFIX}/catalog/categories`, title: "Danh mục sản phẩm" },
    { url: `${ADMIN_PREFIX}/catalog/product-attributes`, title: "Thuộc tính sản phẩm" },
    
    // Inventory Management
    { url: `${ADMIN_PREFIX}/inventory/sizes`, title: "Quản lý Size" },
    { url: `${ADMIN_PREFIX}/inventory/brands`, title: "Thương hiệu" },
    { url: `${ADMIN_PREFIX}/inventory/suppliers`, title: "Nhà cung cấp" },
    { url: `${ADMIN_PREFIX}/inventory/stock-receipts`, title: "Phiếu nhập kho" },
    
    // User Management
    { url: `${ADMIN_PREFIX}/users/accounts`, title: "Quản lý người dùng" },
    { url: `${ADMIN_PREFIX}/users/staff`, title: "Quản lý nhân viên" },
    { url: `${ADMIN_PREFIX}/users/roles`, title: "Quản lý vai trò" },
    { url: `${ADMIN_PREFIX}/users/history`, title: "Lịch sử người dùng" },
    
    // Order Management
    { url: `${ADMIN_PREFIX}/invoices`, title: "Hóa đơn" },
    { url: `${ADMIN_PREFIX}/invoices/detailed`, title: "Chi tiết hóa đơn" },
    
    // Analytics & Reports
    { url: `${ADMIN_PREFIX}/charts`, title: "Biểu đồ thống kê" },
    { url: `${ADMIN_PREFIX}/verification`, title: "Thống kê tài khoản" }
];
