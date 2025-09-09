import React from 'react';

// Components
import RoleList from 'src/components/_admin/roles/roleList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Roles - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Roles() {
  const canView = UsePermissionServer('view_role_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Boxes." redirect="/admin/dashboard" />;
  }

  const canAddRole = UsePermissionServer('add_new_role');
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Roles List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Roles'
          }
        ]}
        action={
          canAddRole
            ? {
                href: `/admin/roles/add`,
                title: 'Add Role'
              }
            : null
        }
      />

      <RoleList />
    </>
  );
}
