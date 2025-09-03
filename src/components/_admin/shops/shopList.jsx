'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Shop from 'src/components/table/rows/shop';
import { LoadingButton } from '@mui/lab';

const TABLE_HEAD = [
  { id: 'name', label: 'Influencers', alignRight: false, sort: true },
  { id: 'products', label: 'Boxes', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: false },
  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient(); // ✅ get queryClient

  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const [markShop, setMarkShop] = useState(null);
  const [openStatus, setOpenStatus] = useState(false);
  const [openBanned, setOpenBanned] = useState(false);

  const { data, isLoading } = useQuery(
    ['admin-shops', apicall, searchParam, pageParam],
    () => api.getShopsByAdmin(+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  // prettier-ignore
  const { mutate: changeActivation, isLoading: activationLoading } = useMutation(
      api.updateShopActiveInactiveByAdmin, // mutation function here
      {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose();
          // ✅ Refetch products list
          queryClient.invalidateQueries(['admin-shops']);
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

  const { mutate: bannedShopMutation, isLoading: bannedLoading } = useMutation(
    api.shopBannedByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['admin-shops']);
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
    setMarkShop(prop);
    setOpenStatus(true);
  };

  const handleClickOpenBanned = (prop) => () => {
    setMarkShop(prop);
    setOpenBanned(true);
  };

  async function changeActiveInactive() {
    try {
      changeActivation({
        slug: markShop.slug,
        isActive: markShop.isActive ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function bannedShop() {
    try {
      bannedShopMutation({
        slug: markShop.slug,
        isBanned: markShop.isBanned ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setOpenStatus(false);
    setOpenBanned(false);
    setMarkShop(null);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint={'deleteShop'}
          type={'Shop deleted'}
          deleteMessage={
            'Are you really sure you want to remove this Influencer? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>

      <Dialog onClose={handleClose} open={openStatus} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markShop?.isActive ? 'Deactivate Influencer' : 'Activate Influencer'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markShop?.isActive
              ? 'Are you sure you want to deactivate this influencer? Don’t worry, you can always activate it again later.'
              : 'Would you like to activate this influencer? Once activated, it will be available right away.'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes, {markShop?.isActive ? 'Deactivate' : 'Activate'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleClose} open={openBanned} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          Ban This Influencer
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to ban this influencer? Once banned, it won’t be available for others to see.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" color="error" loading={bannedLoading} onClick={() => bannedShop()}>
            Yes, Ban It
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Shop}
        handleClickOpen={handleClickOpen}
        handleClickOpenBanned={handleClickOpenBanned}
        handleClickOpenStatus={handleClickOpenStatus}
        isSearch
      />
    </>
  );
}
AdminProducts.propTypes = {
  isVendor: PropTypes.boolean
};
