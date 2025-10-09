'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import OrdersList from 'src/components/_admin/orders/ordersList';

export default function ShopOrderList({ slug }) {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ✅ Build searchBy array dynamically
  const searchBy = [{ key: 'shop', value: slug }];

  if (startDate && endDate) {
    searchBy.push({ key: 'startDate', value: startDate }, { key: 'endDate', value: endDate });
  }

  return (
    <>
      <Box display="flex" flexDirection="column" my={2}>
        <Typography variant="h5" color="text.primary">
          My Order
        </Typography>

        {startDate && endDate && (
          <Typography variant="body2" color="text.secondary">
            Showing orders from <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>
          </Typography>
        )}
      </Box>

      <OrdersList shops={null} searchBy={searchBy} />
    </>
  );
}

ShopOrderList.propTypes = {
  slug: PropTypes.string
};
