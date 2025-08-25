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
  const [brands, setBrands] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: productData } = await api.getProductDetails(slug);
        const { data: brandData } = await api.getAllBrandsByAdmin();
        const { data: shopData } = await api.getAllShopsByAdmin();

        setProductDetails(productData);
        setBrands(brandData);
        setShops(shopData);
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
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Boxes', href: '/admin/products' },
          { name: 'Items' }
        ]}
        action={
          productDetails?.slug
            ? {
                href: `/admin/products/addItem?slug=${productDetails?.slug}`,
                title: 'Add Item To Box'
              }
            : null
        }
      />

      <BoxItemList boxDetails={productDetails} categories={null} shops={shops} brands={brands} />
    </>
  );
}
