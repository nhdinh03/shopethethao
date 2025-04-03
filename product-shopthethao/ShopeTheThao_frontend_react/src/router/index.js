import {
  AdminLayout,
  LayoutPageDefault,
  LayoutPageDefaultUser,
  UserLayout,
} from "layouts";
import * as PageAdmin from "../pages/Admin";
import * as PageUser from "../pages/User";
import NotFound from "../pages/NotFound/notFound";
import { ROUTES, ADMIN_ROUTES } from '../constants/routeConstants';
import OAuth2RedirectHandler from 'components/User/Auth/OAuth2/OAuth2RedirectHandler';

export const publicRoutes = [
  { path: ROUTES.HOME, component: PageUser.HomeIndex, layout: UserLayout },
  { path: ROUTES.SHOP.PRODUCTS, component: PageUser.Products, layout: LayoutPageDefaultUser },
  {
    path: ROUTES.SHOP.DETAILS(":productId"),
    component: PageUser.Seefulldetails,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.USER.WISHLIST,
    component: PageUser.Wishlist,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.USER.CHECKOUT,
    component: PageUser.Checkout,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.USER.ORDERHISTORY,
    component: PageUser.Ordershistory,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.USER.CART,
    component: PageUser.Cart,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.USER.PROFILE,
    component: PageUser.UserProfile,
    layout: LayoutPageDefaultUser,
    requiresAuth: true
  },
  {
    path: ROUTES.AUTH.LOGIN,
    component: PageUser.LoginForm,
    layout: LayoutPageDefault,
  },
  {
    path: ROUTES.USER.ORDERS,
    component: PageUser.Checkorders,
    layout: LayoutPageDefaultUser,
  },
  {
    path: ROUTES.AUTH.OTP,
    component: PageUser.OtpForm,
    layout: LayoutPageDefault,
    requiresUnverified: true, // Add this flag to check auth status
  },
  {
    path: ROUTES.AUTH.OAUTH2_REDIRECT,
    component: OAuth2RedirectHandler,
    layout: LayoutPageDefault,
  },
  {
    path: ROUTES.ERROR.NOT_FOUND,
    component: NotFound,
    layout: LayoutPageDefault,
  },
];

export const privateRoutes = [
  { path: ADMIN_ROUTES.PORTAL, component: PageAdmin.AdminIndex, layout: AdminLayout },
  { path: ADMIN_ROUTES.CATALOG.PRODUCTS, component: PageAdmin.Products, layout: AdminLayout },
  {
    path: ADMIN_ROUTES.CATALOG.CATEGORIES,
    component: PageAdmin.Categories,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVENTORY.SIZES,
    component: PageAdmin.Sizes,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVENTORY.BRANDS,
    component: PageAdmin.Brands,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.ACCOUNTS,
    component: PageAdmin.Accounts,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.COMMENTS,
    component: PageAdmin.Comments,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVOICES.DETAILS,
    component: PageAdmin.Detailed_Invoices,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.CATALOG.ATTRIBUTES,
    component: PageAdmin.ProductAttributes,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVOICES.LIST,
    component: PageAdmin.Invoices,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.ROLES,
    component: PageAdmin.Roles,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.STAFF,
    component: PageAdmin.AccountStaff,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.ACCOUNTSLOCK,
    component: PageAdmin.AccountsLock,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVENTORY.STOCK_RECEIPTS,
    component: PageAdmin.Stock_Receipts,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.INVENTORY.SUPPLIERS,
    component: PageAdmin.Suppliers,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.ANALYTICS.VERIFICATION,
    component: PageAdmin.Verification,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.ANALYTICS.CHARTS,
    component: PageAdmin.Charts,
    layout: AdminLayout,
  },
  {
    path: ADMIN_ROUTES.USERS.HISTORY,
    component: PageAdmin.UserHistory,
    layout: AdminLayout,
  },
];
// Export routes first
export { ROUTES, ADMIN_ROUTES } from '../constants/routeConstants';