import { ROUTES } from 'constants/routeConstants';

export const breadcrumbDataUser = [
  { url: ROUTES.HOME, title: "Trang chủ" },
  { url: ROUTES.SHOP.PRODUCTS, title: "Sản phẩm" },
  { url: ROUTES.SHOP.DETAILS(""), title: "Chi tiết sản phẩm" },
  { url: ROUTES.USER.WISHLIST, title: "Danh sách yêu thích" },
  { url: ROUTES.USER.CHECKOUT, title: "Thanh toán" },
  { url: ROUTES.USER.CART, title: "Giỏ hàng" },
  { url: ROUTES.USER.PROFILE, title: "Thông tin tài khoản" },
  { url: ROUTES.USER.ORDERS, title: "Kiểm tra đơn hàng" },
  { url: ROUTES.USER.ORDERHISTORY, title: "Lịch sử đơn hàng" },
];
