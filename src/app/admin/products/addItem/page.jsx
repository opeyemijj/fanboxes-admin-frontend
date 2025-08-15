'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddBoxItem from 'src/components/_admin/products/addBoxItem';

// api
import * as api from 'src/services';

export default function Page() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [productDetails, setProductDetails] = useState(null);
  const [brands, setBrands] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!slug) return; // wait until slug is available

    async function fetchData() {
      try {
        const { data: categoriesData } = await api.getAllCategories();
        const { data: productData } = await api.getProductDetails(slug);
        const { data: brandData } = await api.getAllBrandsByAdmin();
        const { data: shopData } = await api.getAllShopsByAdmin();

        setProductDetails(productData);
        setBrands(brandData);
        setShops(shopData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [slug]); // re-run if slug changes

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading={productDetails?.name || 'Loading...'}
        links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Box', href: '/admin/products' }, { name: 'Add Item' }]}
      />
      {/* Uncomment when ready */}
      <AddBoxItem boxDetails={productDetails} brands={brands} shops={shops} categories={categories} />
    </div>
  );
}
