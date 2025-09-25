'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// usequery
import { useMutation, useQuery, useQueryClient } from 'react-query';
// mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Slide from 'src/components/table/rows/slide';
import { LoadingButton } from '@mui/lab';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import parseMongooseError from 'src/utils/errorHandler';

const TABLE_HEAD = [
  { id: 'slide', label: 'Slide', alignRight: false },
  { id: 'button', label: 'Button', alignRight: false, sort: true },
  // { id: 'description', label: 'Description', alignRight: false },

  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
// ----------------------------------------------------------------------
export default function SlideList() {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const [openStatus, setOpenStatus] = useState(false);
  const [markSlide, setMarkSlide] = useState(null);

  const { data, isLoading } = useQuery(
    ['slides', apicall, searchParams.toString()],
    () => api.getSlidesByAdmin(searchParams.toString()),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenStatus(false);
    setMarkSlide(null);
  };

  // prettier-ignore
  const { mutate: changeActivation, isLoading: activationLoading } = useMutation(
      api.updateSlideActiveInactiveByAdmin, // mutation function here
      {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose();
          // ✅ Refetch products list
          queryClient.invalidateQueries(['slides']);
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
        slug: markSlide?.slug,
        isActive: markSlide.isActive ? false : true
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleClickOpenStatus = (prop) => () => {
    setMarkSlide(prop);
    setOpenStatus(true);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteSlideByAdmin"
          type={'Slide deleted'}
          deleteMessage={'Deleting this slide will permanently remove it. Are you sure you want to proceed?'}
        />
      </Dialog>

      {/* Modals */}
      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={openStatus} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {markSlide?.isActive ? 'Draft Slide' : 'Approve Slide'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {markSlide?.isActive
              ? 'Are you sure you want to draft this Slide? Don’t worry, you can always approve it again later.'
              : 'Would you like to approve this slide? Once approved, it will be available right away.'}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it
          </Button>
          <LoadingButton variant="contained" loading={activationLoading} onClick={() => changeActiveInactive()}>
            Yes, {markSlide?.isActive ? 'Draft' : 'Approve'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Slide}
        handleClickOpen={handleClickOpen}
        handleClickOpenStatus={handleClickOpenStatus}
        isSearch
      />
    </>
  );
}
