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
  const canView = UsePermissionServer('view_influencer_user_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Influencer." redirect="/admin/dashboard" />;
  }
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Users List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Influencers'
          }
        ]}
      />
      <UsersList userType="vendor" />
    </>
  );
}
