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
    component: PageAdmin.ProductManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/productsizes",
    component: PageAdmin.ProductSizes,
    layout: AdminLayout,
  },

  {
    path: "/admin/categories",
    component: PageAdmin.Categories,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };
