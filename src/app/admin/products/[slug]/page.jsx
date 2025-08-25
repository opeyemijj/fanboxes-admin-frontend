import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditProduct from 'src/components/_admin/products/editProduct';

// api
import * as api from 'src/services';

export default async function page({ params }) {
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

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
      <EditProduct brands={brands} shops={shops} categories={categories} slug={params.slug} />
    </div>
  );
}
