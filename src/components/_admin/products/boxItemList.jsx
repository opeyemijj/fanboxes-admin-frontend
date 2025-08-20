'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import { Dialog, IconButton, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import BoxItem from 'src/components/table/rows/boxItem';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import { Refresh } from '@mui/icons-material';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false, sort: true },
  // { id: 'inventoryType', label: 'Status', alignRight: false, sort: false },
  { id: 'weight', label: 'Weight', alignRight: false, sort: true },
  { id: 'value', label: 'Value', alignRight: false, sort: true },
  {
    id: 'odd',
    label: (
      <Stack direction="row" alignItems="center" spacing={0}>
        <span>Odd</span>
        <IconButton
          style={{ color: 'white' }}
          size="small"
          onClick={() => {
            // 👇 your refresh logic here
            console.log('Odd column refresh clicked');
          }}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>
    ),
    alignRight: false,
    sort: true
  },
  { id: '', label: 'Actions', alignRight: true }
];
export default function AdminBoxeItems({ boxDetails, brands, categories, shops, isVendor }) {
  // console.log(boxDetails, 'Check the box details');
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  // const { data, isLoading } = useQuery(
  //   ['admin-products', apicall, searchParams.toString()],
  //   () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](searchParams.toString()),
  //   {
  //     onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
  //   }
  // );

  // console.log(data, 'Check the data');
  let data = { data: null };
  data.data = boxDetails?.items;

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteProductByAdmin'}
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={false}
        row={BoxItem}
        handleClickOpen={handleClickOpen}
        brands={[]}
        categories={[]}
        isVendor={isVendor}
        filters={
          isVendor
            ? []
            : [
                {
                  name: 'Shop',
                  param: 'shop',
                  data: shops
                },
                {
                  name: 'Category',
                  param: 'category',
                  data: categories
                },
                {
                  name: 'Brand',
                  param: 'brand',
                  data: brands
                }
              ]
        }
        boxDetails={boxDetails}
      />
    </>
  );
}
AdminBoxeItems.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
