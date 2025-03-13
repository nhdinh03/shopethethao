import { AdminLayout, LayoutPageDefault, LayoutPageDefaultUser, UserLayout } from "layouts";
import * as PageAdmin from "../pages/Admin";
import * as PageUser from "../pages/User";
import NotFound from "../pages/NotFound/notFound";

// Constants for route paths
const API_VERSION = 'v1';
const ADMIN_PREFIX = '/dashboard-management-sys';  // Thay đổi /admin thành tên phức tạp hơn

export const publicRoutes = [
  { path: "/", component: PageUser.HomeIndex, layout: UserLayout },
  {
    path: `/${API_VERSION}/shop/products`,  // Thêm version và phân cấp rõ ràng
    component: PageUser.Products,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/shop/seefulldetails/:productId`,  // Chuẩn hóa format URL
    component: PageUser.Seefulldetails,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/user/wishlist`,  // Nhóm các route theo chức năng
    component: PageUser.wishlist,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/user/checkout`,
    component: PageUser.Checkout,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/user/cart`,
    component: PageUser.Cart,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/user/profile`,
    component: PageUser.UserProfile,
    layout: LayoutPageDefaultUser,
  },
  {
    path: `/${API_VERSION}/auth/login`,
    component: PageUser.LoginForm,
    layout: LayoutPageDefault,
  },
  { 
    path: `/${API_VERSION}/auth/otp`, 
    component: PageUser.OtpForm, 
    layout: LayoutPageDefault,
    requiresUnverified: true  // Add this flag to check auth status
  },
  {
    path: `/${API_VERSION}/auth/changepassword`,
    component: PageUser.ChangePasswordForm,
    layout: LayoutPageDefault,
  },
  {
    path: `/${API_VERSION}/404`,
    component: NotFound,
    layout: LayoutPageDefault,
  },
];

export const privateRoutes = [
  {
    path: `${ADMIN_PREFIX}/portal`,  // Thay đổi /admin/index
    component: PageAdmin.AdminIndex,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/catalog/products`,  // Nhóm theo chức năng
    component: PageAdmin.Products,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/catalog/categories`,
    component: PageAdmin.Categories, 
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/inventory/sizes`,
    component: PageAdmin.Sizes,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/inventory/brands`,
    component: PageAdmin.Brands,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/users/accounts`, // Nhóm quản lý user
    component: PageAdmin.Accounts,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/users/comments`,
    component: PageAdmin.Comments,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/invoices/detailed`,
    component: PageAdmin.Detailed_Invoices,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/catalog/product-attributes`,
    component: PageAdmin.ProductAttributes,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/invoices`,
    component: PageAdmin.Invoices,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/users/roles`,
    component: PageAdmin.Roles,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/users/staff`,
    component: PageAdmin.AccountStaff,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/inventory/stock-receipts`,
    component: PageAdmin.Stock_Receipts,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/inventory/suppliers`,
    component: PageAdmin.Suppliers,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/verification`,
    component: PageAdmin.Verification,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/charts`,
    component: PageAdmin.Charts,
    layout: AdminLayout,
  },
  {
    path: `${ADMIN_PREFIX}/users/history`,
    component: PageAdmin.UserHistory,
    layout: AdminLayout,
  },
];
