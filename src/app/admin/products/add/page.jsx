import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddProduct from 'src/components/_admin/products/addProduct';

// api
import * as api from 'src/services';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';
import { SortArrayAlphabetically } from 'src/utils/sorting';

export default async function page() {
  const canAdd = UsePermissionServer('add_new_box');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Box." redirect="/admin/dashboard" />;
  }

  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Box"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Boxes',
            href: '/admin/products'
          },
          {
            name: 'Add Box'
          }
        ]}
      />
      <AddProduct
        brands={brands}
        categories={SortArrayAlphabetically(categories, 'name')}
        shops={SortArrayAlphabetically(shops, 'title')}
      />
    </div>
  );
}
