import React from 'react';

// components
import SpinList from 'src/components/_admin/shops/spinList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Spins - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  const canView = UsePermissionServer('view_spin_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Spins." redirect="/admin/dashboard" />;
  }

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Spins"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Spins'
          }
        ]}
        // action={{
        //   href: `/admin/shops/add`,
        //   title: 'Add Influencer'
        // }}
      />
      <SpinList />
    </>
  );
}
