import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Products - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
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
            href: '/admin'
          },
          {
            name: 'Boxes'
          }
        ]}
        action={{
          href: `/admin/products/add`,
          title: 'Add Box'
        }}
      />
      <ProductList categories={categories} shops={shops} brands={brands} />
    </>
  );
}
