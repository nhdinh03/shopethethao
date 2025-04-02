export const API_VERSION = "Cnhdinh";
export const ADMIN_PREFIX = "nhdinh";

export const ROUTES = {
  HOME: "/",
  SHOP: {
    PRODUCTS: `/${API_VERSION}/shop/products`,
    DETAILS: (productId) => `/${API_VERSION}/shop/seefulldetails/${productId}`,
  },
  USER: {
    PROFILE: `/${API_VERSION}/user/profile`,
    WISHLIST: `/${API_VERSION}/user/wishlist`,
    ORDERHISTORY: `/${API_VERSION}/user/ordershistory`,
    CART: `/${API_VERSION}/user/cart`,
    CHECKOUT: `/${API_VERSION}/user/checkout`,
    ORDERS: `/${API_VERSION}/user/checkorders`,
  },
  AUTH: {
    LOGIN: `/${API_VERSION}/auth/login`,
    OTP: `/${API_VERSION}/auth/otp`,
    OAUTH2_REDIRECT: '/oauth2/redirect',
  },
  ERROR: {
    NOT_FOUND: `/${API_VERSION}/404`,
  },
};

export const ADMIN_ROUTES = {
  PORTAL: `/${ADMIN_PREFIX}`,
  CATALOG: {
    PRODUCTS: `/${ADMIN_PREFIX}/catalog/products`,
    CATEGORIES: `/${ADMIN_PREFIX}/catalog/categories`,
    ATTRIBUTES: `/${ADMIN_PREFIX}/catalog/product-attributes`
  },
  INVENTORY: {
    SIZES: `/${ADMIN_PREFIX}/inventory/sizes`,
    BRANDS: `/${ADMIN_PREFIX}/inventory/brands`,
    SUPPLIERS: `/${ADMIN_PREFIX}/inventory/suppliers`,
    STOCK_RECEIPTS: `/${ADMIN_PREFIX}/inventory/stock-receipts`
  },
  USERS: {
    ACCOUNTS: `/${ADMIN_PREFIX}/users/accounts`,
    STAFF: `/${ADMIN_PREFIX}/users/staff`,
    ACCOUNTSLOCK: `/${ADMIN_PREFIX}/users/accounts/lock`,
    ROLES: `/${ADMIN_PREFIX}/users/roles`,
    HISTORY: `/${ADMIN_PREFIX}/users/history`
  },
  INVOICES: {
    LIST: `/${ADMIN_PREFIX}/invoices`,
    DETAILS: `/${ADMIN_PREFIX}/invoices/detailed`
  },
  ANALYTICS: {
    CHARTS: `/${ADMIN_PREFIX}/charts`,
    VERIFICATION: `/${ADMIN_PREFIX}/verification`
  }
};
