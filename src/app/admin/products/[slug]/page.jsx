import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditProduct from 'src/components/_admin/products/editProduct';

// api
import * as api from 'src/services';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';
import { SortArrayAlphabetically } from 'src/utils/sorting';

export default async function page({ params }) {
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  const canEdit = UsePermissionServer('edit_box');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit Box." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Box"
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
            name: 'Edit Box'
          }
        ]}
      />
      <EditProduct
        brands={brands}
        categories={SortArrayAlphabetically(categories, 'name')}
        shops={SortArrayAlphabetically(shops, 'title')}
        slug={params.slug}
      />
    </div>
  );
}
