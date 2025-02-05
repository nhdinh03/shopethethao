import { AdminLayout } from "layouts";
import * as PageAdmin from "..//pages/Admin";
// import * as PageUser from "~/pages/User";

const publicRoutes = [
  //   { path: "/", component: PageUser.Home, layout: DefaultLayout },
  //   { path: "/contact", component: UserContact, layout: DefaultLayout },
];

const privateRoutes = [
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
  // {
  //   path: "/admin/productsizes",
  //   component: PageAdmin.ProductSizes,
  //   layout: AdminLayout,
  // },

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

  //
  {
    path: "/admin/detailed-invoices",
    component: PageAdmin.Detailed_Invoices,
    layout: AdminLayout,
  },

  {
    path: "/admin/distinctives",
    component: PageAdmin.Distinctives,
    layout: AdminLayout,
  },

  {
    path: "/admin/invoices",
    component: PageAdmin.Invoices,
    layout: AdminLayout,
  },

  {
    path: "/admin/products-distinctives",
    component: PageAdmin.Products_Distinctives,
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


];

export { publicRoutes, privateRoutes };



