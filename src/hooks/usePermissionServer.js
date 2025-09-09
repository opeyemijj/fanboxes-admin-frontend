import { cookies } from 'next/headers';

export function UsePermissionServer(permission) {
  const cookieStore = cookies();
  const permissionsCookie = cookieStore.get('permissions')?.value || '[]';
  const permissions = JSON.parse(decodeURIComponent(permissionsCookie));
  return permissions.includes(permission);
}
