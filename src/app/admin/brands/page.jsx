import React from 'react';

// Components
import BrandList from 'src/components/_admin/brands/brandList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Brands - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Brands() {
  const canView = UsePermissionServer('view_brand_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Brands." redirect="/admin/dashboard" />;
  }

  const canAdd = UsePermissionServer('add_new_brand');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Brands List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Brands'
          }
        ]}
        action={
          canAdd
            ? {
                href: `/admin/brands/add`,
                title: 'Add brand'
              }
            : null
        }
      />
      <BrandList />
    </>
  );
}
