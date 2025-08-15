import React from 'react';

// components
import BoxItemList from 'src/components/_admin/products/boxItemList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Products - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminBoxeItems() {
  const { data: productDetails } = await api.getProductDetails('box-name-1');
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  console.log(productDetails, 'Getting the detail?asdfsdf');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading={productDetails?.name}
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
          title: 'Add Box Item'
        }}
      />
      <BoxItemList boxDetails={productDetails} categories={null} shops={shops} brands={brands} />
    </>
  );
}
