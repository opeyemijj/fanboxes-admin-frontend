'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
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
import AssignUsersModal from 'src/components/modals/assignUser';

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
export default function AdminProducts({ brands, categories, shops, isVendor, searchBy }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // always set searchBy (replace if exists, add if not)
  if (searchBy) {
    params.set(searchBy.key, searchBy.value);
  }

  const queryClient = useQueryClient(); // ✅ get queryClient

  const [modalType, setModalType] = useState('');

  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const [markBox, setMarkBox] = useState(null);

  // Assigned to state
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading } = useQuery(
    ['admin-products', apicall, params.toString()],
    () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](params.toString()),
    {
      onSuccess: () => {
        setRefreshKey(refreshKey + 1);
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

  const { mutate: assignUserMutation, isLoading: assignLoading } = useMutation(
    isVendor ? null : api.updateAssignInProductByAdmin, // mutation function here
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
    setModalType('delete');
  };

  const handleClickOpenStatus = (prop) => () => {
    setMarkBox(prop);
    setModalType('status');
  };

  const handleClickOddsVisibility = (prop) => () => {
    setMarkBox(prop);
    setModalType('odd-visibility');
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
    setModalType('bann');
  };

  const handleClose = () => {
    setMarkBox(null);
    setModalType('');
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

  async function openAssignUsers(row) {
    setMarkBox(row);
    setModalType('assign');
  }

  // Handle user checkbox toggle

  return (
    <>
      <Table
        key={refreshKey}
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        handleClickOpenStatus={handleClickOpenStatus}
        handleClickOpenBanned={handleClickOpenBanned}
        handleClickOddsVisibility={handleClickOddsVisibility}
        openAssignUsers={openAssignUsers}
        oddsVisibileLoading={oddsVisibileLoading}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isSearch={!searchBy ? true : false}
        filters={
          searchBy
            ? []
            : [
                {
                  name: 'Influencer',
                  param: 'shop',
                  data: shops
                },
                {
                  name: 'Category',
                  param: 'category',
                  data: categories
                }
                // {
                //   name: 'Brand',
                //   param: 'brand',
                //   data: brands
                // }
              ]
        }
      />

      {/* Assign Users Modal */}
      {modalType === 'assign' && (
        <AssignUsersModal
          open={modalType === 'assign'}
          onClose={handleClose}
          markItem={markBox}
          assignLoading={assignLoading}
          onAssign={(payload) => assignUserMutation(payload)}
        />
      )}

      {/* Delete Modal */}
      <Dialog onClose={handleClose} open={modalType === 'delete'} maxWidth={'xs'}>
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

      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={modalType === 'status'} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markBox?.isActive ? 'Draft Box' : 'Approve Box'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markBox?.isActive
              ? 'Are you sure you want to draft this box? Don’t worry, you can always approve it again later.'
              : 'Would you like to approve this box? Once approved, it will be available right away.'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes, {markBox?.isActive ? 'Draft' : 'Approve'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Banned Modal */}
      <Dialog onClose={handleClose} open={modalType === 'bann'} maxWidth="xs">
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

      {/* How hide odds modal */}
      <Dialog onClose={handleClose} open={modalType === 'odd-visibility'} maxWidth="xs">
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
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
