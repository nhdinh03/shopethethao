const API_VERSION = "v1";

export const breadcrumbDataUser = [
  { url: "/", title: "Trang chủ" },
  { url: `/${API_VERSION}/shop/products`, title: "Sản phẩm" },
  { url: `/${API_VERSION}/shop/seefulldetails`, title: "Chi tiết sản phẩm" },
  { url: `/${API_VERSION}/user/wishlist`, title: "Danh sách yêu thích" },
  { url: `/${API_VERSION}/user/checkout`, title: "Thanh toán" },
  { url: `/${API_VERSION}/user/cart`, title: "Giỏ hàng" },
  { url: `/${API_VERSION}/user/profile`, title: "Thông tin tài khoản" },
  { url: `/${API_VERSION}/user/checkorders`, title: "Kiểm tra đơn hàng" },
];
