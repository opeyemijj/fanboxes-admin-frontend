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
import parseMongooseError from 'src/utils/errorHandler';
import * as Yup from 'yup';

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

  const [modalType, setModalType] = useState('');

  const [markUser, setMarkUser] = useState(null);
  const [markUserCurrentBalance, setMarkUserCurrentBalance] = useState(0);
  const [count, setCount] = useState(0);

  // TOP UP STATE
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [openTopUp, setOpenTopUp] = useState(false);
  const amounts = [5, 10, 15, 20, 25, 30, 40, 50];
  const [finalAmount, setFinalAmmount] = useState(0);

  const queryClient = useQueryClient();
  const pageParam = searchParams.get('page');

  const { data, isLoading } = useQuery(
    ['user', searchParams.toString()],
    () => api.getUserByAdminsByAdmin(searchParams.toString(), userType),
    {
      onError: (err) => {
        toast.error(err.message || 'Something went wrong!');
      }
    }
  );

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

  // ✅ Yup validation schema
  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Password is required.').min(8, 'Password should be 8 characters or longer.'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
      .required('Confirm Password is required.')
  });

  // ✅ Change Password Mutation
  // ✅ Change Password Mutation
  const { mutate: changePasswordMutation, isLoading: passwordLoading } = useMutation(api.updateUserPasswordByAdmin, {
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully');
      handleClose();
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      console.error(error);
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage || 'Something went wrong while changing the password.');
    }
  });
  // password modal states

  // password modal states
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = async () => {
    try {
      // Clear previous errors
      setPasswordErrors({});

      // Validate with Yup
      await passwordSchema.validate(passwordData, { abortEarly: false });

      // Submit mutation
      changePasswordMutation({
        userId: markUser?._id,
        newPassword: passwordData.newPassword
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setPasswordErrors(newErrors);
      } else {
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    setOpenTopUp(false);
    setModalType('');
    setMarkUser(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setMarkUserCurrentBalance(0);
    setFinalAmmount(0);
    setPasswordData({ newPassword: '', confirmPassword: '' }); // reset password modal fields
  };

  const handleClickOpenStatus = (prop) => () => {
    setMarkUser(prop);
    setModalType('status');
  };

  async function handleClickOpenPassword(prop) {
    setMarkUser(prop);
    setModalType('change-password');
  }

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
        data={
          data
            ? { ...data, currentPage: Number(pageParam) }
            : { success: true, data: [], total: 0, count: 0, currentPage: 1 }
        }
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        id={setId}
        handleClickOpenStatus={handleClickOpenStatus}
        handleClickOpenTopUp={handleClickOpenTopUp}
        handleClickOpenPassword={handleClickOpenPassword}
        isSearch
        userType={userType}
      />

      {/* Modals */}
      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={modalType === 'status'} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markUser?.isActive ? 'Draft User' : 'Approve User'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markUser?.isActive
              ? 'Are you sure you want to draft this user? Don’t worry, you can always approve it again later.'
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
        <DialogTitle mb={2} sx={{ fontWeight: 'bold', fontSize: 20 }}>
          Quick Top Up
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {/* Divider */}
            <Divider />

            {/* User info */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                Top Up For {markUser?.firstName} {markUser?.lastName}
              </Typography>

              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="subtitle1">Current Balance:</Typography>
                <Typography variant="h6" color="primary">
                  {markUserCurrentBalance || 0}
                </Typography>
              </Box>
            </Box>

            {/* Divider */}
            <Divider />

            {/* Select amount */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Choose your top up amount
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {amounts?.map((amt) => (
                  <Button
                    key={amt}
                    variant={selectedAmount === amt ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: '50%',
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

            {/* Divider */}
            <Divider />

            {/* Final amounts */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="subtitle1">Top Up Amount:</Typography>
                <Typography variant="h6" color="primary">
                  {finalAmount ? finalAmount : 0}
                </Typography>
              </Box>

              {finalAmount > 0 && (
                <Box display="flex" gap={1} alignItems="center">
                  <Typography variant="subtitle1">New Balance:</Typography>
                  <Typography variant="h6" color="primary">
                    {Number(finalAmount) + Number(markUserCurrentBalance)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
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

      {/* ✅ CHANGE PASSWORD MODAL */}
      <Dialog onClose={handleClose} open={modalType === 'change-password'} maxWidth="sm" fullWidth>
        <DialogTitle mb={2} sx={{ fontWeight: 'bold', fontSize: 20 }}>
          Change Password
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                error={Boolean(passwordErrors.newPassword)}
                helperText={passwordErrors.newPassword}
                required
              />
            </Box>

            <Box>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                error={Boolean(passwordErrors.confirmPassword)}
                helperText={passwordErrors.confirmPassword}
                required
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handlePasswordChange}
            loading={passwordLoading}
            disabled={!passwordData.newPassword || !passwordData.confirmPassword}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
