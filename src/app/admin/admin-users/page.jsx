import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersList from 'src/components/_admin/users/userList';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'User - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default function page() {
  const canView = UsePermissionServer('view_admin_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Admin Users." redirect="/admin/dashboard" />;
  }

  const canAddAdmin = UsePermissionServer('add_new_admin');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Admin List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Admin Users'
          }
        ]}
        action={
          canAddAdmin
            ? {
                href: `/admin/admin-users/add`,
                title: 'Add Admin'
              }
            : null
        }
      />
      <UsersList userType="admin" />
    </>
  );
}
