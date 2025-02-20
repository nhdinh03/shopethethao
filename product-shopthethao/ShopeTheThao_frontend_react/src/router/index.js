import { AdminLayout, LayoutPageDefault, UserLayout } from "layouts";
import { HomePage, Login } from "../pages/User";
import * as PageAdmin from "../pages/Admin";



export const publicRoutes = [
  { path: "/", component: HomePage, layout: UserLayout },
  {
    path: "/login",
    component: Login,
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
    path: "/admin/user-histories",
    component: PageAdmin.User_Histories,
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
];
