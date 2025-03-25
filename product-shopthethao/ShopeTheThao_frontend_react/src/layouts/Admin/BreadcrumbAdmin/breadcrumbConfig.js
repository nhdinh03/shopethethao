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
    SafetyCertificateOutlined,
    LockFilled
} from '@ant-design/icons';
import { ADMIN_ROUTES } from '../../../constants/routeConstants';
import { Lock } from 'lucide-react';

export const breadcrumbData = [
    // Catalog Management
    { 
        url: ADMIN_ROUTES.CATALOG.PRODUCTS, 
        title: "Quản lý Sản phẩm", 
        icon: <ShoppingOutlined />,
        premium: true 
    },
    { 
        url: ADMIN_ROUTES.CATALOG.CATEGORIES, 
        title: "Danh mục sản phẩm", 
        icon: <AppstoreOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.CATALOG.ATTRIBUTES, 
        title: "Thuộc tính sản phẩm", 
        icon: <TagOutlined />,
        premium: true
    },
    
    // Inventory Management
    { 
        url: ADMIN_ROUTES.INVENTORY.SIZES, 
        title: "Quản lý Size", 
        icon: <ColumnWidthOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.INVENTORY.BRANDS, 
        title: "Thương hiệu", 
        icon: <TagsOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.INVENTORY.SUPPLIERS, 
        title: "Nhà cung cấp", 
        icon: <ShopOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.INVENTORY.STOCK_RECEIPTS, 
        title: "Phiếu nhập kho", 
        icon: <FileTextOutlined /> 
    },
    
    // User Management
    { 
        url: ADMIN_ROUTES.USERS.ACCOUNTS, 
        title: "Quản lý người dùng", 
        icon: <UserOutlined />,
        premium: true 
    },
    { 
        url: ADMIN_ROUTES.USERS.STAFF, 
        title: "Quản lý nhân viên", 
        icon: <IdcardOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.USERS.ACCOUNTSLOCK, 
        title: "Quản lý tài khoản bị khóa", 
        icon: <LockFilled /> 
    },
    { 
        url: ADMIN_ROUTES.USERS.ROLES, 
        title: "Quản lý vai trò", 
        icon: <TeamOutlined /> 
    },
    { 
        url: ADMIN_ROUTES.USERS.HISTORY, 
        title: "Lịch sử người dùng", 
        icon: <HistoryOutlined /> 
    },
    
    // Order Management
    { 
        url: ADMIN_ROUTES.INVOICES.LIST, 
        title: "Hóa đơn", 
        icon: <FileTextOutlined />,
        premium: true 
    },
    { 
        url: ADMIN_ROUTES.INVOICES.DETAILS, 
        title: "Chi tiết hóa đơn", 
        icon: <FileSearchOutlined /> 
    },
    
    // Analytics & Reports
    { 
        url: ADMIN_ROUTES.ANALYTICS.CHARTS, 
        title: "Biểu đồ thống kê", 
        icon: <BarChartOutlined />,
        premium: true 
    },
    { 
        url: ADMIN_ROUTES.ANALYTICS.VERIFICATION, 
        title: "Thống kê tài khoản", 
        icon: <SafetyCertificateOutlined /> 
    }
];
