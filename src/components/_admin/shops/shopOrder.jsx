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

import OrderList from 'src/components/table/rows/orderList';

// mui
import { Typography } from '@mui/material';
const TABLE_HEAD = [
  { id: 'orderNo', label: 'Order No', alignRight: false },
  { id: 'items', label: 'item', alignRight: false },
  { id: 'name', label: 'User', alignRight: false },
  { id: 'transaction', label: 'Transaction Type', alignRight: false, sort: true },
  { id: 'transactionAmount', label: 'Amount', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false, sort: true },

  { id: 'inventoryType', label: 'status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];
export default function ShopOrderList({ slug, onUpdatePayment, isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const [count, setCount] = useState(0);
  const { data, isLoading: loadingList } = useQuery(['orders', pageParam, count], () =>
    api[isVendor ? 'getIncomeByVendor' : 'getShopwiseOrdersByAdmin'](slug, pageParam)
  );

  const isLoading = loadingList;

  return (
    <>
      <Typography variant="h5" color="text.primary" my={2}>
        Order
      </Typography>

      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={OrderList}
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
ShopOrderList.propTypes = {
  slug: PropTypes.string
};
