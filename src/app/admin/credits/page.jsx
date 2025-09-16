import React from 'react';

// Components
import CreditList from 'src/components/_admin/credits/creditList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Categories() {
  // const canView = UsePermissionServer('view_category_listing'); // check required permission

  // if (!canView) {
  //   return <AccessDenied message="You are not allowed to manage Category." redirect="/admin/dashboard" />;
  // }

  const canAddCategory = UsePermissionServer('add_new_category');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Credits & Conversionis"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Credits'
          }
        ]}
        action={{
          href: `/admin/credits/add`,
          title: 'Add Converstion'
        }}
      />

      <CreditList />
    </>
  );
}
