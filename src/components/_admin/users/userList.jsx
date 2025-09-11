'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
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

const TABLE_HEAD = [
  { id: 'name', label: 'User', alignRight: false, sort: true },
  { id: 'email', label: 'Email', alignRight: false, sort: true },
  { id: 'phone', label: 'phone', alignRight: false, sort: false },
  { id: 'orders', label: 'Orders', alignRight: false, sort: true },
  { id: 'role', label: 'Role', alignRight: false, sort: true },
  { id: 'joined', label: 'Joined', alignRight: false, sort: true },

  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminProducts({ userType }) {
  const searchParams = useSearchParams();
  const [openStatus, setOpenStatus] = useState(false);
  const [markUser, setMarkUser] = useState(null);
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [count, setCount] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['user', pageParam, searchParam, count],
    () => api.getUserByAdminsByAdmin(+pageParam || 1, searchParam || '', userType),
    {
      onError: (err) => {
        toast.error(err.response.data.message || 'Something went wrong!');
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
    setMarkUser(null);
  };

  const handleClickOpenStatus = (prop) => () => {
    setMarkUser(prop);
    setOpenStatus(true);
  };

  return (
    <>
      <RoleDialog open={Boolean(id)} onClose={() => setId(null)} onClick={() => mutate(id)} loading={roleLoading} />
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        id={setId}
        handleClickOpenStatus={handleClickOpenStatus}
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
            Yes, {markUser?.isActive ? 'Draft' : 'Approved'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
