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

// 👇 Add this line
export const dynamic = 'force-dynamic';
export const revalidate = 0; // 👈 add this

export default async function page() {
  const { data: allBrandsData } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();
  const canAdd = UsePermissionServer('add_new_brand');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Brand." redirect="/admin/dashboard" />;
  }

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
      <AddItem
        brands={SortArrayAlphabetically(allBrandsData, 'name')}
        shops={SortArrayAlphabetically(shops, 'title')}
      />
    </div>
  );
}
