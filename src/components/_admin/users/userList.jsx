'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { LoadingButton } from '@mui/lab';

// api
import * as api from 'src/services';
import { useQuery, useQueryClient } from 'react-query';
import { useMutation } from 'react-query';
// component
import Table from 'src/components/table/table';
import UserList from 'src/components/table/rows/usersList';
import RoleDialog from 'src/components/dialog/role';

export default function AdminProducts({ userType }) {
  const TABLE_HEAD = [
    { id: 'name', label: 'User', alignRight: false, sort: true },
    { id: 'email', label: 'Email', alignRight: false, sort: true },
    { id: 'currentBalance', label: 'Wallet Balance', alignRight: false, sort: true },
    ...(userType === 'admin' ? [{ id: 'role', label: 'Role', alignRight: false, sort: true }] : []),
    { id: 'status', label: 'Status', alignRight: false, sort: true },
    { id: 'joined', label: 'Joined', alignRight: false, sort: true },
    { id: '', label: 'Actions', alignRight: true }
  ];
  const searchParams = useSearchParams();
  const [openStatus, setOpenStatus] = useState(false);

  const [markUser, setMarkUser] = useState(null);
  const [markUserCurrentBalance, setMarkUserCurrentBalance] = useState(0);
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [count, setCount] = useState(0);

  // TOP UP STATE
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [openTopUp, setOpenTopUp] = useState(false);
  const amounts = [5, 10, 15, 20, 25, 30, 40, 50];
  const [finalAmount, setFinalAmmount] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['user', pageParam, searchParam, count],
    () => api.getUserByAdminsByAdmin(+pageParam || 1, searchParam || '', userType),
    {
      onError: (err) => {
        toast.error(err.message || 'Something went wrong!');
      }
    }
  );

  console.log(data, 'Check the data');

  const [id, setId] = useState(null);

  const { mutate, isLoading: roleLoading } = useMutation(api.updateUserRoleByAdmin, {
    onSuccess: (data) => {
      toast.success(data.message);
      setCount((prev) => prev + 1);
      setId(null);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      setId(null);
    }
  });

  // prettier-ignore
  const { mutate: changeActivation, isLoading: activationLoading } = useMutation(
    api.updateUserActiveInactiveByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['user']);
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
  const { mutate: topUpMutation, isLoading: topUploading } = useMutation(
    api.updateUserTopUpByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['user']);
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

  async function changeActiveInactive() {
    try {
      changeActivation({
        _id: markUser?._id,
        isActive: markUser.isActive ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    setOpenStatus(false);
    setOpenTopUp(false);
    setMarkUser(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setMarkUserCurrentBalance(0);
    setFinalAmmount(0);
  };

  const handleClickOpenStatus = (prop) => () => {
    setMarkUser(prop);
    setOpenStatus(true);
  };

  async function handleClickOpenTopUp(prop) {
    setMarkUser(prop);
    setOpenTopUp(true);
    setMarkUserCurrentBalance(prop?.currentBalance || 0);
  }

  const handleConfirmTopUp = () => {
    try {
      topUpMutation({
        userId: markUser?._id,
        amount: finalAmount,
        description: 'Credits Topup',
        currency: '',
        remarks: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <RoleDialog open={Boolean(id)} onClose={() => setId(null)} onClick={() => mutate(id)} loading={roleLoading} />
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        id={setId}
        handleClickOpenStatus={handleClickOpenStatus}
        handleClickOpenTopUp={handleClickOpenTopUp}
        isSearch
        userType={userType}
      />

      {/* Modals */}
      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={openStatus} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markUser?.isActive ? 'Draft User' : 'Approve User'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markUser?.isActive
              ? 'Are you sure you want to draft this box? Don’t worry, you can always approve it again later.'
              : 'Would you like to approve this user? Once approved, it will be available right away.'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes, {markUser?.isActive ? 'Draft' : 'Approve'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* QUICK TOP UP MODAL */}
      {/* QUICK TOP UP MODAL */}
      <Dialog onClose={handleClose} open={openTopUp} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20 }}>Quick Top Up</DialogTitle>

        <DialogContent>
          {/* User name */}
          <Box display={'flex'} gap={4} mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Topping For {markUser?.firstName} {markUser?.lastName}
            </Typography>

            <Box display={'flex'} gap={2} mb={2}>
              <Typography variant="subtitle1">Current Balance:</Typography>
              <Typography variant="h6" color="primary">
                {markUserCurrentBalance || 0}
              </Typography>
            </Box>
          </Box>

          {/* Divider before top-up section */}
          <Divider sx={{ my: 2 }} />

          {/* Select amount */}
          <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Choose your top up amount
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {amounts?.map((amt) => (
                <Button
                  key={amt}
                  variant={selectedAmount === amt ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '50%', // ✅ Perfect circle
                    width: 40,
                    height: 60,
                    minWidth: 0,
                    fontWeight: 'bold'
                  }}
                  onClick={() => {
                    setFinalAmmount(amt);
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                >
                  {amt}
                </Button>
              ))}

              {/* Custom input */}
              <TextField
                type="number"
                placeholder="Custom"
                value={customAmount}
                onChange={(e) => {
                  setFinalAmmount(e.target.value);
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                sx={{ width: 100 }}
                size="small"
              />
            </Stack>
          </Box>

          {/* Divider before Top Up Amount */}
          <Divider sx={{ my: 2 }} />

          {/* Final selected value */}
          <Box display={'flex'} gap={2} mb={2}>
            <Typography variant="subtitle1">Top Up Amount:</Typography>
            <Typography variant="h6" color="primary">
              {finalAmount ? `${finalAmount}` : 'None'}
            </Typography>
          </Box>

          {finalAmount > 0 && (
            <Box display={'flex'} gap={2} mb={2}>
              <Typography variant="subtitle1">New Balance:</Typography>
              <Typography variant="h6" color="primary">
                {Number(finalAmount) + Number(markUserCurrentBalance)}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleConfirmTopUp}
            loading={topUploading}
            disabled={!customAmount && !selectedAmount}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
