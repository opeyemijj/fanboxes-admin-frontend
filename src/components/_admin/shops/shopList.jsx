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
import AssignUsersModal from 'src/components/modals/assignUser';
import parseMongooseError from 'src/utils/errorHandler';

const TABLE_HEAD = [
  { id: 'name', label: 'Influencers', alignRight: false, sort: true },
  { id: 'products', label: 'Boxes', alignRight: false, sort: true },
  { id: 'visitedCount', label: 'Total Visit', alignRight: false, sort: true },
  { id: 'category', label: 'Category', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: false },
  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminShops({ categories }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient(); // ✅ get queryClient

  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const [markShop, setMarkShop] = useState(null);

  const [modalType, setModalType] = useState('');
  const [multipleActionType, setMultipleActionType] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);

  // Assigned to state
  const [openAssignTo, setOpenAssignedTo] = useState(false);

  const { data, isLoading } = useQuery(
    ['admin-shops', apicall, searchParams.toString()],
    () => api.getShopsByAdmin(searchParams.toString()),
    {
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

  const { mutate: assignUserMutation, isLoading: assignLoading } = useMutation(
    modalType === 'assignSelectedRecords' ? api.updateMulitpleAssignInShopByAdmin : api.updateAssignInShopByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['admin-shops']);
      },
      onError: (error) => {
        let errorMessage = parseMongooseError(error?.message);
        console.log(errorMessage, 'Find the error message');
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
    setMarkShop(prop);
    setModalType(modalType);

    if (activityType) {
      setMultipleActionType(activityType);
    }
  };

  const handleClickOpenBanned = (prop, modalType, activityType) => () => {
    setMarkShop(prop);
    setModalType(modalType);

    if (activityType) {
      setMultipleActionType(activityType);
    }
  };

  async function changeActiveInactive() {
    if (modalType === 'singleStatus') {
      try {
        changeActivation({
          slug: markShop.slug,
          isActive: markShop.isActive ? false : true,
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

  async function bannedShop() {
    if (modalType === 'singleBanned') {
      try {
        bannedShopMutation({
          slug: markShop.slug,
          isBanned: markShop.isBanned ? false : true,
          mutationType: 'single'
        });
      } catch (error) {
        console.error(error);
      }
    } else if (modalType === 'multipleBanned') {
      try {
        bannedShopMutation({
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

  const handleClose = () => {
    setMarkShop(null);
    setOpenAssignedTo(false);

    setSelectedRows([]);
    setModalType('');
    setMultipleActionType('');
  };

  async function openAssignUsers(row) {
    setMarkShop(row);
    setModalType('assign');
  }

  function UpdateSelectedRow(id) {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  }

  async function openAssignUsersForSelectedRecords() {
    setModalType('assignSelectedRecords');
  }

  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Shop}
        handleClickOpen={handleClickOpen}
        handleClickOpenBanned={handleClickOpenBanned}
        handleClickOpenStatus={handleClickOpenStatus}
        openAssignUsers={openAssignUsers}
        UpdateSelectedRow={UpdateSelectedRow}
        selectedRows={selectedRows}
        bulkAction={[
          {
            actionName: 'Approve',
            action: handleClickOpenStatus(null, 'multipleStatus', 'active')
          },
          {
            actionName: 'Draft',
            action: handleClickOpenStatus(null, 'multipleStatus', 'inactive')
          },
          {
            actionName: 'Bann',
            action: handleClickOpenBanned(null, 'multipleBanned', 'bann')
          },
          {
            actionName: 'Unbann',
            action: handleClickOpenBanned(null, 'multipleBanned', 'unbann')
          },
          {
            actionName: 'Assign',
            action: openAssignUsersForSelectedRecords
          }
        ]}
        isSearch
        filters={[
          {
            name: 'Category',
            param: 'category',
            data: categories
          }
        ]}
      />

      {/* Assign Users Modal */}
      {(modalType === 'assign' || modalType === 'assignSelectedRecords') && (
        <AssignUsersModal
          open={modalType === 'assign' || modalType === 'assignSelectedRecords'}
          onClose={handleClose}
          markItem={markShop}
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
          endPoint={'deleteShop'}
          type={'Influencer deleted'}
          deleteMessage={
            'Are you sure you’d like to remove this influencer? Once deleted, all of their related boxes will also be removed. We just want to double-check before moving forward.'
          }
        />
      </Dialog>

      {/* Active Inacive modal */}
      <Dialog onClose={handleClose} open={modalType === 'multipleStatus' || modalType === 'singleStatus'} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <WarningRoundedIcon sx={{ mr: 1 }} />
          {modalType === 'singleStatus'
            ? markShop?.isActive
              ? 'Move Influencer to Draft'
              : 'Approve Influencer'
            : multipleActionType === 'active'
              ? 'Approve Influencers'
              : 'Move Influencers to Draft'}
        </DialogTitle>

        <DialogContent>
          {modalType === 'singleStatus' ? (
            <DialogContentText>
              {markShop?.isActive
                ? 'Are you sure you want to move this influencer to draft? Don’t worry, you can approve it again anytime.'
                : 'Do you want to approve this influencer? Once approved, it will be available immediately.'}
            </DialogContentText>
          ) : (
            <DialogContentText>
              {multipleActionType !== 'active'
                ? 'Are you sure you want to move these influencers to draft? Don’t worry, you can approve them again anytime.'
                : 'Do you want to approve these influencers? Once approved, they will be available immediately.'}
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
              ? markShop?.isActive
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
            ? markShop?.isBanned
              ? 'Unban This Influencer'
              : 'Ban This Influencer'
            : modalType === 'multipleBanned'
              ? multipleActionType === 'bann'
                ? 'Ban Influencers'
                : 'Unban Influencers'
              : ''}
        </DialogTitle>

        <DialogContent>
          {modalType === 'singleBanned' ? (
            <DialogContentText>
              {markShop?.isBanned
                ? 'Would you like to unban this influencer? Once unbanned, it will be visible and available to others again.'
                : 'Are you sure you want to ban this influencer? Once banned, it will be hidden and won’t be available for others to see.'}
            </DialogContentText>
          ) : (
            <DialogContentText>
              {multipleActionType === 'unbann'
                ? 'Would you like to unban these influencers? Once unbanned, these will be visible and available to others again.'
                : 'Are you sure you want to ban these influencers? Once banned, these will be hidden and won’t be available for others to see.'}
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No, keep it as is
          </Button>
          <LoadingButton
            variant="contained"
            color={markShop?.isBanned ? 'primary' : 'error'}
            loading={bannedLoading}
            onClick={() => bannedShop()}
          >
            {modalType === 'singleBanned'
              ? markShop?.isBanned
                ? 'Yes, Unban It'
                : 'Yes, Ban It'
              : multipleActionType === 'unbann'
                ? 'Yes, Unban'
                : 'Yes, Ban'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
AdminShops.propTypes = {
  isVendor: PropTypes.boolean
};
