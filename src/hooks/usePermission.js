'use client';

import { useSelector } from 'react-redux';

export function usePermission(permission) {
  const { user } = useSelector((state) => state.user);

  const permissions = user?.permissions || [];

  console.log(permissions.includes(permission), 'what is this', user);

  return permissions.includes(permission);
}
