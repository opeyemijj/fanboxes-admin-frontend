import React from 'react';

// components
import TransectionList from 'src/components/_admin/transactions/transactionList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Boxes - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  const canView = UsePermissionServer('view_transections_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to see transection." redirect="/admin/dashboard" />;
  }

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Transections"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Transections'
          }
        ]}
        // action={{
        //   href: `/admin/shops/add`,
        //   title: 'Add Influencer'
        // }}
      />
      <TransectionList />
    </>
  );
}
