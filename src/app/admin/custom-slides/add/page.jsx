import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCategory from 'src/components/_admin/categories/addCategory';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  const canAdd = UsePermissionServer('add_new_category');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Category." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories',
            href: '/admin/categories'
          },
          {
            name: 'Add Category'
          }
        ]}
      />
      <AddCategory />
    </div>
  );
}
