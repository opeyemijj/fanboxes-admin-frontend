import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Boxes - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Boxes List"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Box'
          }
        ]}
        action={{
          href: `/vendor/products/add`,
          title: 'Add Box'
        }}
      />
      <ProductList isVendor />
    </>
  );
}
