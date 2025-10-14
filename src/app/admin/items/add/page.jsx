import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddItem from 'src/components/_admin/items/addItem';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Add Item - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  // const canAdd = UsePermissionServer('add_new_category');
  // if (!canAdd) {
  //   return <AccessDenied message="You are not allowed to add Category." redirect="/admin/dashboard" />;
  // }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Item"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Items',
            href: '/admin/items'
          },
          {
            name: 'Add Item'
          }
        ]}
      />
      <AddItem />
    </div>
  );
}
