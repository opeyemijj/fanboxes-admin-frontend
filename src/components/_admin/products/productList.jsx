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
import { UsePermission } from 'src/hooks/usePermission';

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
  const [multipleActionType, setMultipleActionType] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);

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
    api.updateProductActiveInactiveByAdmin, // mutation function here
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
    modalType === 'assignSelectedRecords' ? api.updateMulitpleAssignInProductByAdmin : api.updateAssignInProductByAdmin, // mutation function here
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
    api.productBannedByAdmin, // mutation function here
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
    api.updateItemOddHideShowByAdmin, // mutation function here
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

  const handleClickOpenStatus = (prop, modalType, activityType) => () => {
    setMarkBox(prop);
    setModalType(modalType);

    if (activityType) {
      setMultipleActionType(activityType);
    }
  };

  const handleClickOddsVisibility = (prop, modalType, activityType) => () => {
    setMarkBox(prop);
    setModalType(modalType);

    if (activityType) {
      setMultipleActionType(activityType);
    }
  };

  function OddMutaion() {
    if (modalType === 'single-odd-visibility') {
      try {
        oddsVisibileMutaion({
          slug: markBox.slug,
          isItemOddsHidden: markBox.isItemOddsHidden ? false : true,
          mutationType: 'single'
        });
      } catch (error) {
        console.error(error);
      }
    } else if (modalType === 'multiple-odd-visibility') {
      try {
        oddsVisibileMutaion({
          slug: '',
          isItemOddsHidden: multipleActionType === 'showOdds' ? false : true, //if showOdds then hidden false
          selectedItems: selectedRows,
          mutationType: 'multiple'
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleClickOpenBanned = (prop, modalType, activityType) => () => {
    setMarkBox(prop);
    setModalType(modalType);

    if (activityType) {
      setMultipleActionType(activityType);
    }
  };

  const handleClose = () => {
    setMarkBox(null);
    setModalType('');
    setSelectedRows([]);
    setMultipleActionType('');
  };

  async function changeActiveInactive() {
    if (modalType === 'singleStatus') {
      try {
        changeActivation({
          slug: markBox.slug,
          isActive: markBox.isActive ? false : true,
          mutationType: 'single'
        });
      } catch (error) {
        console.error(error);
      }
    } else if (modalType === 'multipleStatus') {
      try {
        changeActivation({
          slug: '',
          isActive: multipleActionType === 'active' ? true : false,
          selectedItems: selectedRows,
          mutationType: 'multiple'
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function bannedProduct() {
    if (modalType === 'singleBanned') {
      try {
        bannedProductMutation({
          slug: markBox.slug,
          isBanned: markBox.isBanned ? false : true,
          mutationType: 'single'
        });
      } catch (error) {
        console.error(error);
      }
    } else if (modalType === 'multipleBanned') {
      try {
        bannedProductMutation({
          slug: '',
          isBanned: multipleActionType === 'bann' ? true : false,
          selectedItems: selectedRows,
          mutationType: 'multiple'
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function openAssignUsers(row) {
    setMarkBox(row);
    setModalType('assign');
  }

  function UpdateSelectedRow(id, type, checkType) {
    if (type === 'single') {
      setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    } else if (type === 'all') {
      if (checkType) {
        // ✅ Select all IDs
        const allIds = data?.data?.map((item) => item._id) || [];
        setSelectedRows(allIds);
      } else {
        // ✅ Deselect all
        setSelectedRows([]);
      }
    }
  }

  async function openAssignUsersForSelectedRecords() {
    setModalType('assignSelectedRecords');
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
        UpdateSelectedRow={UpdateSelectedRow}
        selectedRows={selectedRows}
        handleClickOpen={handleClickOpen}
        handleClickOpenStatus={handleClickOpenStatus}
        handleClickOpenBanned={handleClickOpenBanned}
        handleClickOddsVisibility={handleClickOddsVisibility}
        openAssignUsers={openAssignUsers}
        oddsVisibileLoading={oddsVisibileLoading}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isSearch={!searchBy ? true : false}
        bulkAction={[
          {
            hasPermission: UsePermission('approve_box'),
            actionName: 'Approve',
            action: handleClickOpenStatus(null, 'multipleStatus', 'active')
          },

          {
            hasPermission: UsePermission('approve_box'),
            actionName: 'Draft',
            action: handleClickOpenStatus(null, 'multipleStatus', 'inactive')
          },

          {
            hasPermission: UsePermission('ban_unban_box'),
            actionName: 'Ban',
            action: handleClickOpenBanned(null, 'multipleBanned', 'bann')
          },
          {
            hasPermission: UsePermission('ban_unban_box'),
            actionName: 'Unban',
            action: handleClickOpenBanned(null, 'multipleBanned', 'unbann')
          },
          {
            hasPermission: UsePermission('hide_unhide_item_odd'),
            actionName: 'Show Odds',
            action: handleClickOddsVisibility(null, 'multiple-odd-visibility', 'showOdds')
          },

          {
            hasPermission: UsePermission('hide_unhide_item_odd'),
            actionName: 'Hide Odds',
            action: handleClickOddsVisibility(null, 'multiple-odd-visibility', 'hideOdds')
          },
          {
            hasPermission: UsePermission('assign_box_to_user'),
            actionName: 'Assign',
            action: openAssignUsersForSelectedRecords
          }
        ]}
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
      {(modalType === 'assign' || modalType === 'assignSelectedRecords') && (
        <AssignUsersModal
          open={modalType === 'assign' || modalType === 'assignSelectedRecords'}
          onClose={handleClose}
          markItem={markBox}
          assignLoading={assignLoading}
          onAssign={(payload) => assignUserMutation(payload)}
          selectedRows={modalType === 'assignSelectedRecords' ? selectedRows : []}
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
      <Dialog onClose={handleClose} open={modalType === 'multipleStatus' || modalType === 'singleStatus'} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {modalType === 'singleStatus'
            ? markBox?.isActive
              ? 'Move Box to Draft'
              : 'Approve Box'
            : multipleActionType === 'active'
              ? 'Approve Boxes'
              : 'Move Boxes to Draft'}
        </DialogTitle>

        <DialogContent>
          {modalType === 'singleStatus' ? (
            <DialogContentText>
              {markBox?.isActive
                ? 'Are you sure you want to move this box to draft? Don’t worry, you can approve it again anytime.'
                : 'Do you want to approve this box? Once approved, it will be available immediately.'}
            </DialogContentText>
          ) : (
            <DialogContentText>
              {multipleActionType !== 'active'
                ? 'Are you sure you want to move these boxes to draft? Don’t worry, you can approve them again anytime.'
                : 'Do you want to approve these boxes? Once approved, they will be available immediately.'}
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes,&nbsp;
            {modalType === 'singleStatus'
              ? markBox?.isActive
                ? 'Move to Draft'
                : 'Approve'
              : multipleActionType !== 'active'
                ? 'Move to Draft'
                : 'Approve'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Banned Modal */}
      <Dialog onClose={handleClose} open={modalType === 'multipleBanned' || modalType === 'singleBanned'} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {modalType === 'singleBanned'
            ? markBox?.isBanned
              ? 'Unban This Box'
              : 'Ban This Box'
            : modalType === 'multipleBanned'
              ? multipleActionType === 'bann'
                ? 'Ban Boxes'
                : 'Unban Boxes'
              : ''}
        </DialogTitle>

        <DialogContent>
          {modalType === 'singleBanned' ? (
            <DialogContentText>
              {markBox?.isBanned
                ? 'Would you like to unban this box? Once unbanned, it will be visible and available to others again.'
                : 'Are you sure you want to ban this box? Once banned, it will be hidden and won’t be available for others to see.'}
            </DialogContentText>
          ) : (
            <DialogContentText>
              {multipleActionType === 'unbann'
                ? 'Would you like to unban these boxes? Once unbanned, these will be visible and available to others again.'
                : 'Are you sure you want to ban these boxes? Once banned, these will be hidden and won’t be available for others to see.'}
            </DialogContentText>
          )}
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
            {modalType === 'singleBanned'
              ? markBox?.isBanned
                ? 'Yes, Unban It'
                : 'Yes, Ban It'
              : multipleActionType === 'unbann'
                ? 'Yes, Unban'
                : 'Yes, Ban'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* How hide odds modal */}
      <Dialog
        onClose={handleClose}
        open={modalType === 'single-odd-visibility' || modalType === 'multiple-odd-visibility'}
        maxWidth="xs"
      >
        {modalType === 'single-odd-visibility' ? (
          <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <WarningRoundedIcon sx={{ mr: 1 }} color="warning" />
            {markBox?.isItemOddsHidden ? 'Show Item Odds' : 'Hide Item Odds'}
          </DialogTitle>
        ) : (
          <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <WarningRoundedIcon sx={{ mr: 1 }} color="warning" />
            {multipleActionType === 'showOdds' ? 'Show Items Odds' : 'Hide Items Odds'}
          </DialogTitle>
        )}

        <DialogContent>
          {modalType === 'single-odd-visibility' ? (
            <DialogContentText>
              {markBox?.isItemOddsHidden
                ? 'Would you like to make the item odds visible to your customers?'
                : 'Would you like to keep the item odds private from customers?'}
            </DialogContentText>
          ) : (
            <DialogContentText>
              {multipleActionType === 'showOdds'
                ? 'Would you like to make these items odds visible to your customers?'
                : 'Would you like to keep these items odds private from customers?'}
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, leave it as is
          </Button>
          <LoadingButton variant="contained" loading={oddsVisibileLoading} onClick={() => OddMutaion()}>
            Yes,{' '}
            {modalType === 'single-odd-visibility'
              ? markBox?.isItemOddsHidden
                ? 'Show Odds'
                : 'Hide Odds'
              : multipleActionType === 'showOdds'
                ? 'Show Odds'
                : 'Hide Odds'}
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
