import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddItem from 'src/components/_admin/items/addItem';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';
// Meta information
export const metadata = {
  title: 'Add Item - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function page() {
  const { data: allBrandsData } = await api.getAllBrandsByAdmin();
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
      <AddItem brands={SortArrayAlphabetically(allBrandsData, 'name')} />
    </div>
  );
}
