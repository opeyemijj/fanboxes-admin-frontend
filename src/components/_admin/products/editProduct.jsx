'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import ProductForm from 'src/components/forms/product';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.boolean
};

export default function EditProduct({ brands, categories, slug, shops, isVendor }) {
  const { data, isLoading } = useQuery(
    ['signle-product'],
    () => api[isVendor ? 'getVendorProductBySlug' : 'getOneProductByAdmin'](slug),
    {
      onError: (err) => {
        toast.error(err.message || 'Something went wrong!');
      }
    }
  );

  console.log('product data', data);
  return (
    <div>
      <ProductForm
        shops={shops}
        brands={brands}
        categories={categories}
        currentProduct={data?.data}
        isLoading={isLoading}
        isVendor={isVendor}
      />
    </div>
  );
}
