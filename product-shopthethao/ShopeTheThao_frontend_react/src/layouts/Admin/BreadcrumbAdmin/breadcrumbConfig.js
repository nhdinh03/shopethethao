import React from 'react';
import { 
    ShoppingOutlined, 
    AppstoreOutlined, 
    TagOutlined, 
    ColumnWidthOutlined, 
    TagsOutlined,
    ShopOutlined,
    UserOutlined,
    IdcardOutlined,
    TeamOutlined,
    HistoryOutlined,
    FileTextOutlined,
    FileSearchOutlined,
    BarChartOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const ADMIN_PREFIX = "/dashboard-management-sys";

export const breadcrumbData = [
    // Catalog Management
    { 
        url: `${ADMIN_PREFIX}/catalog/products`, 
        title: "Quản lý Sản phẩm", 
        icon: <ShoppingOutlined />,
        premium: true 
    },
    { 
        url: `${ADMIN_PREFIX}/catalog/categories`, 
        title: "Danh mục sản phẩm", 
        icon: <AppstoreOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/catalog/product-attributes`, 
        title: "Thuộc tính sản phẩm", 
        icon: <TagOutlined />,
        premium: true
    },
    
    // Inventory Management
    { 
        url: `${ADMIN_PREFIX}/inventory/sizes`, 
        title: "Quản lý Size", 
        icon: <ColumnWidthOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/inventory/brands`, 
        title: "Thương hiệu", 
        icon: <TagsOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/inventory/suppliers`, 
        title: "Nhà cung cấp", 
        icon: <ShopOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/inventory/stock-receipts`, 
        title: "Phiếu nhập kho", 
        icon: <FileTextOutlined /> 
    },
    
    // User Management
    { 
        url: `${ADMIN_PREFIX}/users/accounts`, 
        title: "Quản lý người dùng", 
        icon: <UserOutlined />,
        premium: true 
    },
    { 
        url: `${ADMIN_PREFIX}/users/staff`, 
        title: "Quản lý nhân viên", 
        icon: <IdcardOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/users/roles`, 
        title: "Quản lý vai trò", 
        icon: <TeamOutlined /> 
    },
    { 
        url: `${ADMIN_PREFIX}/users/history`, 
        title: "Lịch sử người dùng", 
        icon: <HistoryOutlined /> 
    },
    
    // Order Management
    { 
        url: `${ADMIN_PREFIX}/invoices`, 
        title: "Hóa đơn", 
        icon: <FileTextOutlined />,
        premium: true 
    },
    { 
        url: `${ADMIN_PREFIX}/invoices/detailed`, 
        title: "Chi tiết hóa đơn", 
        icon: <FileSearchOutlined /> 
    },
    
    // Analytics & Reports
    { 
        url: `${ADMIN_PREFIX}/charts`, 
        title: "Biểu đồ thống kê", 
        icon: <BarChartOutlined />,
        premium: true 
    },
    { 
        url: `${ADMIN_PREFIX}/verification`, 
        title: "Thống kê tài khoản", 
        icon: <SafetyCertificateOutlined /> 
    }
];
