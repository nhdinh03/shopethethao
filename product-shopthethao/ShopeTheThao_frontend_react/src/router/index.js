import { AdminLayout, UserLayout } from "layouts";
import * as PageAdmin from "..//pages/Admin";
import * as PageUser from "..//pages/User";

const publicRoutes = [
  { path: "/", component: PageUser.HomePage, layout: UserLayout },

  {
    path: "/login",
    component: PageUser.Login,
    layout: UserLayout,
  },
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

export { publicRoutes, privateRoutes };
