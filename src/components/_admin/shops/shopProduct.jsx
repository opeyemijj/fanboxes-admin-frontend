'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import Table from 'src/components/table/table';

import Product from 'src/components/table/rows/product';

// mui
import { Typography } from '@mui/material';
import ProductList from 'src/components/_admin/products/productList';
const TABLE_HEAD = [
  { id: 'name', label: 'Box', alignRight: false, sort: true },
  { id: 'influencer', label: 'Influencer', alignRight: false, sort: true },
  { id: 'owner', label: 'Owner', alignRight: false, sort: true },
  { id: 'visitedCount', label: 'Total Visit', alignRight: false, sort: true },
  { id: 'items', label: 'Items', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date Created', alignRight: false, sort: true }
];
export default function ShopProductList({ slug, onUpdatePayment, isVendor }) {
  return (
    <>
      <Typography variant="h5" color="text.primary" my={2}>
        My Box
      </Typography>

      <ProductList categories={null} shops={null} brands={null} searchBy={{ key: 'shop', value: slug }} />
    </>
  );
}
ShopProductList.propTypes = {
  slug: PropTypes.string
};
