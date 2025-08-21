'use client';
import React, { useEffect, useState } from 'react';
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
import { useMutation, useQuery } from 'react-query';
import { Refresh } from '@mui/icons-material';

export default function AdminBoxeItems({ boxDetails, brands, categories, shops, isVendor }) {
  // console.log(boxDetails, 'Check the box details');
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const [data, setData] = useState(null);

  // let data = { data: null };
  // data.data = boxDetails?.items;

  // prettier-ignore
  const { mutate: updateItemsOdd, isLoading: loadingUpdateOdd } = useMutation(
    api.updateBoxItemOddByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Something went wrong!');
      }
    }
  );

  async function UpateItemOdd(passingItems) {
    try {
      updateItemsOdd({
        boxSlug: boxDetails.slug,
        items: passingItems.data
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (boxDetails) {
      const temdata = { data: boxDetails.items };
      setData(temdata);
    }
  }, [boxDetails]);

  function distributeItems(items) {
    // Step 1: compute inverses of values
    const inverses = items.map((item) => (item.value > 0 ? 1 / item.value : 0));

    // Step 2: total of inverses
    const totalInverse = inverses.reduce((sum, inv) => sum + inv, 0);

    // Step 3: calculate odds and weights
    return items.map((item, i) => {
      const odd = totalInverse > 0 ? inverses[i] / totalInverse : 0;
      const weight = odd * 100;
      return {
        ...item,
        odd: parseFloat(odd.toFixed(6)), // keep precision
        weight: parseFloat(weight.toFixed(2)) // percentage
      };
    });
  }

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
            disabled={loadingUpdateOdd}
            style={{ color: 'white' }}
            size="small"
            onClick={() => {
              // 👇 your refresh logic here
              if (boxDetails) {
                const distributedItem = distributeItems(boxDetails?.items);
                const temdata = { data: distributedItem };
                UpateItemOdd(temdata);
                setData(temdata);
              }
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

  // console.log(data, 'Check the data');

  const handleClickOpen = (prop) => () => {
    const lastSegment = fullUrl.substring(fullUrl.lastIndexOf('/') + 1);
    setId({ itemSlug: prop, boxSlug: lastSegment });
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
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteBoxItemByAdmin'}
          type={'Item deleted'}
          deleteMessage={
            'Are you really sure you want to remove this item? Just making sure before we go ahead with it.'
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
