import { ROLES, ROLE_ROUTES, ROLE_MESSAGES, ROLE_PERMISSIONS } from '../hooks/roles';

export const getHighestRole = (userRoles) => {
  const roleHierarchy = [
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.SUPPLIER,
    ROLES.STAFF,
    ROLES.USER
  ];

  if (!userRoles || userRoles.length === 0) return ROLES.USER;
  
  return userRoles.reduce((highest, current) => {
    const currentIndex = roleHierarchy.indexOf(current);
    const highestIndex = roleHierarchy.indexOf(highest);
    return currentIndex < highestIndex ? current : highest;
  }, ROLES.USER);
};

export const getRedirectPath = (roles) => {
  const highestRole = getHighestRole(roles);
  return ROLE_ROUTES[highestRole] || '/';
};

export const getLoginMessage = (roles) => {
  const highestRole = getHighestRole(roles);
  return ROLE_MESSAGES[highestRole] || 'Đăng nhập thành công!';
};

export const isAdminRole = (userRoles) => {
  const adminRoles = [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPLIER, ROLES.STAFF];
  const highestRole = getHighestRole(userRoles);
  return adminRoles.includes(highestRole);
};

export const hasPermission = (userRoles, requiredPermission) => {
  if (!userRoles || userRoles.length === 0) return false;
  
  const highestRole = getHighestRole(userRoles);
  const permissions = ROLE_PERMISSIONS[highestRole] || [];
  return permissions.includes('all') || permissions.includes(requiredPermission);
};
