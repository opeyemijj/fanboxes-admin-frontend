'use client';
import React, { useEffect, useState } from 'react';

// components
import BoxItemList from 'src/components/_admin/products/boxItemList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { useParams } from 'next/navigation';

// api
import * as api from 'src/services';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

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

  const canView = UsePermission('view_box_details'); // check required permission
  const canAddBoxItem = UsePermission('add_box_item');

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Boxes Items." redirect="/admin/dashboard" />;
  }

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
          productDetails?.slug && canAddBoxItem
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
