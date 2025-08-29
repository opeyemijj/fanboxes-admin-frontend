'use client';
import React, { useEffect, useState } from 'react';

// components
import BoxItemList from 'src/components/_admin/products/boxItemList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { useParams } from 'next/navigation';

// api
import * as api from 'src/services';

export default function AdminBoxItems() {
  const { slug } = useParams();

  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: productData } = await api.getProductDetails(slug);
        console.log(productData, 'Getting prodcut data?');

        setProductDetails(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading={productDetails?.name || 'Loading...'}
        links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Boxes', href: '/vendor/products' }, { name: 'Items' }]}
        action={{
          href: `/vendor/products/addItem?slug=${productDetails?.slug}`,
          title: 'Add Item'
        }}
      />

      <BoxItemList boxDetails={productDetails} categories={null} isVendor />
    </>
  );
}
