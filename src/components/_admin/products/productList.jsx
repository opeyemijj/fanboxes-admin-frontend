'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
// api
import * as api from 'src/services';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import parseMongooseError from 'src/utils/errorHandler';

const TABLE_HEAD = [
  { id: 'name', label: 'Box', alignRight: false, sort: true },
  { id: 'influencer', label: 'Influencer', alignRight: false, sort: true },
  { id: 'owner', label: 'Owner', alignRight: false, sort: true },
  { id: 'visitedCount', label: 'Total Visit', alignRight: false, sort: true },
  { id: 'items', label: 'Items', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date Created', alignRight: false, sort: true },
  // { id: 'inventoryType', label: 'Status', alignRight: false, sort: false },
  { id: '', label: 'Actions', alignRight: true }
];
export default function AdminProducts({ brands, categories, shops, isVendor }) {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient(); // ✅ get queryClient

  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openOddsVisible, setOpenOddsVisible] = useState(false);
  const [openBanned, setOpenBanned] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const [markBox, setMarkBox] = useState(null);
  const { data, isLoading } = useQuery(
    ['admin-products', apicall, searchParams.toString()],
    () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](searchParams.toString()),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  // prettier-ignore
  const { mutate: changeActivation, isLoading: activationLoading } = useMutation(
    isVendor ? null : api.updateProductActiveInactiveByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['admin-products']);
      },
      onError: (error) => {
        console.log(error);
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  // prettier-ignore
  const { mutate: bannedProductMutation, isLoading: bannedLoading } = useMutation(
    isVendor ? null : api.productBannedByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['admin-products']);
      },
      onError: (error) => {
        console.log(error);
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  // prettier-ignore
  const { mutate: oddsVisibileMutaion, isLoading: oddsVisibileLoading } = useMutation(
    isVendor ? null : api.updateItemOddHideShowByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['admin-products']);
      },
      onError: (error) => {
        console.log(error);
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };

  const handleClickOpenStatus = (prop) => () => {
    setMarkBox(prop);
    setOpenStatus(true);
  };

  const handleClickOddsVisibility = (prop) => () => {
    setMarkBox(prop);
    setOpenOddsVisible(true);
  };

  function OddMutaion() {
    try {
      oddsVisibileMutaion({
        slug: markBox.slug,
        isItemOddsHidden: markBox.isItemOddsHidden ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleClickOpenBanned = (prop) => () => {
    setMarkBox(prop);
    setOpenBanned(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenStatus(false);
    setOpenBanned(false);
    setOpenOddsVisible(false);
    setMarkBox(null);
  };

  async function changeActiveInactive() {
    try {
      changeActivation({
        slug: markBox.slug,
        isActive: markBox.isActive ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function bannedProduct() {
    try {
      bannedProductMutation({
        slug: markBox.slug,
        isBanned: markBox.isBanned ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

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
            'Are you really sure you want to remove this box? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>

      <Dialog onClose={handleClose} open={openStatus} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markBox?.isActive ? 'Deactivate Box' : 'Activate Box'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markBox?.isActive
              ? 'Are you sure you want to deactivate this box? Don’t worry, you can always activate it again later.'
              : 'Would you like to activate this box? Once activated, it will be available right away.'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes, {markBox?.isActive ? 'Deactivate' : 'Activate'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleClose} open={openBanned} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markBox?.isBanned ? 'Restore This Box' : 'Hide This Box'}
        </DialogTitle>

        <Dialog onClose={handleClose} open={openBanned} maxWidth="xs">
          <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <WarningRoundedIcon sx={{ mr: 1 }} />
            {markBox?.isBanned ? 'Unban This Box' : 'Ban This Box'}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {markBox?.isBanned
                ? 'Would you like to unban this box? Once unbanned, it will be visible and available to others again.'
                : 'Are you sure you want to ban this box? Once banned, it will be hidden and won’t be available for others to see.'}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              No, keep it as is
            </Button>
            <LoadingButton
              variant="contained"
              color={markBox?.isBanned ? 'primary' : 'error'}
              loading={bannedLoading}
              onClick={() => bannedProduct()}
            >
              {markBox?.isBanned ? 'Yes, Unban It' : 'Yes, Ban It'}
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, leave it as is
          </Button>
          <LoadingButton
            variant="contained"
            color={markBox?.isBanned ? 'primary' : 'error'}
            loading={bannedLoading}
            onClick={() => bannedProduct()}
          >
            {markBox?.isBanned ? 'Yes, Restore It' : 'Yes, Hide It'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleClose} open={openOddsVisible} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} color="warning" />
          {markBox?.isItemOddsHidden ? 'Show Item Odds' : 'Hide Item Odds'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markBox?.isItemOddsHidden
              ? 'Would you like to make the item odds visible to your customers?'
              : 'Would you like to keep the item odds private from customers?'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, leave it as is
          </Button>
          <LoadingButton variant="contained" loading={oddsVisibileLoading} onClick={() => OddMutaion()}>
            Yes, {markBox?.isItemOddsHidden ? 'Show Odds' : 'Hide Odds'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        handleClickOpenStatus={handleClickOpenStatus}
        handleClickOpenBanned={handleClickOpenBanned}
        handleClickOddsVisibility={handleClickOddsVisibility}
        oddsVisibileLoading={oddsVisibileLoading}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
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
        isSearch
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
