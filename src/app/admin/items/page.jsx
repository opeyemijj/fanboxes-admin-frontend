import React from 'react';

// Components
import CategoryList from 'src/components/_admin/categories/categoryList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Items - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Items() {
  // const canView = UsePermissionServer('view_category_listing'); // check required permission

  // if (!canView) {
  //   return <AccessDenied message="You are not allowed to manage Category." redirect="/admin/dashboard" />;
  // }

  // const canAddCategory = UsePermissionServer('add_new_category');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Item List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Itmes'
          }
        ]}
        action={{
          href: `/admin/items/add`,
          title: 'Add Item'
        }}
      />

      <CategoryList />
    </>
  );
}
