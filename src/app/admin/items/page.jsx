import React from 'react';

// Components
import ItemList from 'src/components/_admin/items/itemList';
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
  const canView = UsePermissionServer('view_item_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Item." redirect="/admin/dashboard" />;
  }

  const canAddItem = UsePermissionServer('add_new_item');

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
            name: 'Items'
          }
        ]}
        action={
          canAddItem
            ? {
                href: `/admin/items/add`,
                title: 'Add Item'
              }
            : null
        }
      />

      <ItemList />
    </>
  );
}
