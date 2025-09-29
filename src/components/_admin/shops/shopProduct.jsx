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
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const [count, setCount] = useState(0);
  const { data, isLoading: loadingList } = useQuery(['income', pageParam, count], () =>
    api[isVendor ? 'getIncomeByVendor' : 'getShopwiseProductsByAdmin'](slug, pageParam)
  );

  const isLoading = loadingList;

  return (
    <>
      <Typography variant="h5" color="text.primary" my={2}>
        Box
      </Typography>

      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Product}
        showAction={false}
        handleClickOpenStatus={null}
        handleClickOddsVisibility={null}
        oddsVisibileLoading={null}
        handleClickOpenBanned={null}
        isSearch={false}
        showRowCount={false}
        showPagination={false}
      />
    </>
  );
}
ShopProductList.propTypes = {
  slug: PropTypes.string
};
