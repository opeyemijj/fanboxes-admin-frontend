'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import AccountList from 'src/components/_admin/accounts/accountList';

export default function ShopAccountList({ slug }) {
  const searchParams = useSearchParams();

  // ✅ Build searchBy array dynamically
  const searchBy = [{ key: 'shop', value: slug }];

  return (
    <>
      <Box display="flex" flexDirection="column" my={2}>
        <Typography variant="h5" color="text.primary">
          My Transactions
        </Typography>
      </Box>

      <AccountList shops={null} searchBy={searchBy} />
    </>
  );
}

ShopAccountList.propTypes = {
  slug: PropTypes.string
};
