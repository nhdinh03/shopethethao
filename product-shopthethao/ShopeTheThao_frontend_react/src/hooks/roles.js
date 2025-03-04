export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER',
  SUPPLIER: 'SUPPLIER',
  STAFF: 'STAFF'
};

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: '/admin/index',
  [ROLES.MANAGER]: '/admin/index',
  [ROLES.SUPPLIER]: '/admin/index',
  [ROLES.STAFF]: '/admin/index',
  [ROLES.USER]: '/'
};

export const ROLE_MESSAGES = {
  [ROLES.ADMIN]: 'Đăng nhập quyền quản trị viên thành công!',
  [ROLES.MANAGER]: 'Đăng nhập quyền quản lý thành công!',
  [ROLES.SUPPLIER]: 'Đăng nhập quyền nhà cung cấp thành công!',
  [ROLES.STAFF]: 'Đăng nhập quyền nhân viên thành công!',
  [ROLES.USER]: 'Đăng nhập thành công!'
};
