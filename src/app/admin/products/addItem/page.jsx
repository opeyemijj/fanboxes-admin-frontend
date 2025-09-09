'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddBoxItem from 'src/components/_admin/products/addBoxItem';

// api
import * as api from 'src/services';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

export default function Page() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (!slug) return; // wait until slug is available

    async function fetchData() {
      try {
        const { data: productData } = await api.getProductDetails(slug);

        setProductDetails(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [slug]); // re-run if slug changes

  const canAdd = UsePermission('add_box_item');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Item." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading={productDetails?.name || 'Loading...'}
        links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Box', href: '/admin/products' }, { name: 'Add Item' }]}
      />
      {/* Uncomment when ready */}
      <AddBoxItem boxDetails={productDetails} />
    </div>
  );
}
