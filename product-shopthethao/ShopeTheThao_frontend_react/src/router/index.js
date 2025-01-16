import * as PageAdmin from "..//pages/Admin";
// import * as PageUser from "~/pages/User";
import { AdminLayout, DefaultLayout } from "..//layouts";

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
];

export { publicRoutes, privateRoutes };
