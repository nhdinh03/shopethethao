import { ROLES, ROLE_ROUTES, ROLE_MESSAGES } from '../hooks/roles';

export const getHighestRole = (userRoles) => {
  const roleHierarchy = [
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.SUPPLIER,
    ROLES.STAFF,
    ROLES.USER
  ];

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
