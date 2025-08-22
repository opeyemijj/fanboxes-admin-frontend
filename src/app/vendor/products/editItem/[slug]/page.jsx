'use client';
import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditItem from 'src/components/_admin/products/editItem';

// api
import * as api from 'src/services';
import { useSelector } from 'react-redux';

export default function Page({ params }) {
  const selectedBoxAndItemData = useSelector(({ product }) => product?.boxAndItemData);
  // console.log(selectedBoxAndItemData, 'Okk SEE this state');

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Item"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Products',
            href: '/admin/products'
          },
          {
            name: 'Edit Item'
          }
        ]}
      />
      <EditItem selectedBoxAndItemData={selectedBoxAndItemData} slug={params.slug} />
    </div>
  );
}
