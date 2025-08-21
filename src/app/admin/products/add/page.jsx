import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddProduct from 'src/components/_admin/products/addProduct';

// api
import * as api from 'src/services';

export default async function page() {
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
            href: '/admin'
          },
          {
            name: 'Boxs',
            href: '/admin/products'
          },
          {
            name: 'Add Box'
          }
        ]}
      />
      <AddProduct brands={brands} shops={shops} categories={categories} />
    </div>
  );
}
