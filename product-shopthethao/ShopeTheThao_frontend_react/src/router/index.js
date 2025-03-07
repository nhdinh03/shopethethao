import { AdminLayout, LayoutPageDefault, UserLayout } from "layouts";
import * as PageAdmin from "../pages/Admin";
import * as PageUser from "../pages/User";
import NotFound from "../pages/NotFound/notFound";

export const publicRoutes = [
  { path: "/", component: PageUser.HomeIndex, layout: UserLayout },
  { path: "/products", component: PageUser.Products, layout: UserLayout },
  {
    path: "/login",
    component: PageUser.LoginForm,
    layout: LayoutPageDefault,
  },
  {
    path: "/register",
    component: PageUser.RegisterForm,
    layout: LayoutPageDefault,
  },
  { path: "/otp", component: PageUser.OtpForm, layout: LayoutPageDefault },
  {
    path: "/changepassword",
    component: PageUser.ChangePasswordForm,
    layout: LayoutPageDefault,
  },
  {
    path: "/forgotpassword",
    component: PageUser.ResetPasswordForm,
    layout: LayoutPageDefault,
  },
  {
    path: "/404",
    component: NotFound,
    layout: LayoutPageDefault,
  },
];

export const privateRoutes = [
  {
    path: "/admin/index",
    component: PageAdmin.AdminIndex,
    layout: AdminLayout,
  },
  {
    path: "/admin/product",
    component: PageAdmin.Products,
    layout: AdminLayout,
  },
  {
    path: "/admin/categories",
    component: PageAdmin.Categories,
    layout: AdminLayout,
  },
  {
    path: "/admin/sizes",
    component: PageAdmin.Sizes,
    layout: AdminLayout,
  },
  {
    path: "/admin/brands",
    component: PageAdmin.Brands,
    layout: AdminLayout,
  },
  {
    path: "/admin/account",
    component: PageAdmin.Accounts,
    layout: AdminLayout,
  },
  {
    path: "/admin/comment",
    component: PageAdmin.Comments,
    layout: AdminLayout,
  },
  {
    path: "/admin/detailed-invoices",
    component: PageAdmin.Detailed_Invoices,
    layout: AdminLayout,
  },
  {
    path: "/admin/product-attributes",
    component: PageAdmin.ProductAttributes,
    layout: AdminLayout,
  },
  {
    path: "/admin/invoices",
    component: PageAdmin.Invoices,
    layout: AdminLayout,
  },
  {
    path: "/admin/roles",
    component: PageAdmin.Roles,
    layout: AdminLayout,
  },
  {
    path: "/admin/accountStaff",
    component: PageAdmin.AccountStaff,
    layout: AdminLayout,
  },
  {
    path: "/admin/stock-receipts",
    component: PageAdmin.Stock_Receipts,
    layout: AdminLayout,
  },
  {
    path: "/admin/suppliers",
    component: PageAdmin.Suppliers,
    layout: AdminLayout,
  },
  {
    path: "/admin/verification",
    component: PageAdmin.Verification,
    layout: AdminLayout,
  },
  {
    path: "/admin/charts",
    component: PageAdmin.Charts,
    layout: AdminLayout,
  },

  {
    path: "/admin/userhistory",
    component: PageAdmin.UserHistory,
    layout: AdminLayout,
  },
];
