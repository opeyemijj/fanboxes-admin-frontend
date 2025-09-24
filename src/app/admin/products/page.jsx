import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// api
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';

// Meta information
export const metadata = {
  title: 'Boxes - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  const canView = UsePermissionServer('view_box_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Boxes." redirect="/admin/dashboard" />;
  }

  const canAddBox = UsePermissionServer('add_new_box');

  const { data: categories } = await api.getAllCategoriesByAdmin();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Box List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Boxes'
          }
        ]}
        action={
          canAddBox
            ? {
                href: `/admin/products/add`,
                title: 'Add Box'
              }
            : null
        }
      />
      <ProductList
        categories={SortArrayAlphabetically(categories, 'name')}
        shops={SortArrayAlphabetically(shops, 'title')}
        brands={brands}
      />
    </>
  );
}
