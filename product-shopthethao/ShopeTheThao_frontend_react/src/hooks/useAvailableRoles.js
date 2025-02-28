import { useMemo } from 'react';

export const useAvailableRoles = (existingRoles) => {
  const allRoles = ['USER', 'MANAGER', 'SUPPLIER', 'STAFF'];
  
  const availableRoles = useMemo(() => {
    const existingRoleNames = existingRoles.map(role => role.name);
    return allRoles.filter(role => !existingRoleNames.includes(role));
  }, [existingRoles]);

  return availableRoles;
};
