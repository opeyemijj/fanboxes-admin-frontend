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

  // Assigned to state
  const [openAssignTo, setOpenAssignedTo] = useState(false);
  const [assignUsers, setAssignUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

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
    setOpenAssignedTo(false);
    setMarkBox(null);
    setSelectedUserDetails([]);
    setSelectedUsers([]);
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

  // Fetch users when modal opens
  async function openAssignUsers() {
    setOpenAssignedTo(true);
    setLoadingUsers(true);
    try {
      const res = await api.getRoleWiseUserToAssign(1, '', 'admin');
      setAssignUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }

  // Handle user checkbox toggle
  const handleToggleUser = (user) => {
    setSelectedUsers((prev) => (prev.includes(user._id) ? prev.filter((id) => id !== user._id) : [...prev, user._id]));

    setSelectedUserDetails((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      return exists
        ? prev.filter((u) => u._id !== user._id) // remove if already selected
        : [...prev, { _id: user._id, firstName: user.firstName, lastName: user.lastName }];
    });
  };

  // Filtered users based on search
  const filteredUsers = assignUsers.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Delete Modal */}
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

      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={openStatus} maxWidth="xs">
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
            Yes, {markBox?.isActive ? 'Draft' : 'Approved'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Banned Modal */}
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

      {/* How hide odds modal */}
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
        openAssignUsers={openAssignUsers}
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

      {/* Assign Users Modal */}
      <Dialog onClose={handleClose} open={openAssignTo} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} color="primary" />
          Assign Users
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Select one or more users to assign.</DialogContentText>

          {/* Fixed height container */}
          <Box sx={{ height: 420, display: 'flex', flexDirection: 'column' }}>
            {/* Search Input */}
            <TextField
              variant="outlined"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <WarningRoundedIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />
              }}
              sx={{ mb: 2 }}
            />

            {/* Content Area */}
            <Box sx={{ flex: 1, overflowY: 'auto', borderRadius: 1, border: '1px solid #eee', p: 1 }}>
              {loadingUsers ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <CircularProgress />
                </Stack>
              ) : (
                <Stack spacing={1}>
                  {filteredUsers.length === 0 && <DialogContentText align="center">No users found.</DialogContentText>}

                  {filteredUsers.map((user) => (
                    <Stack
                      key={user._id}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 1,
                        transition: 'background 0.2s',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleToggleUser(user)} />
                      <Typography variant="body1">{`${user.firstName} ${user.lastName}`}</Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
            {selectedUsers.length > 0 ? `${selectedUsers.length} user(s) selected` : 'No user selected'}
          </Typography>
          <Box>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <LoadingButton
              disabled={selectedUsers.length < 1 ? true : false}
              variant="contained"
              onClick={() => {
                console.log('Selected Users:', selectedUsers);
                console.log('Selected User Details:', selectedUserDetails);
                toast.success('Users assigned successfully!');
                handleClose();
              }}
            >
              Assign
            </LoadingButton>
          </Box>
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
