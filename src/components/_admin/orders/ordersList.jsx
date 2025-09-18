'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import OrderList from 'src/components/table/rows/orderList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Dialog } from '@mui/material';
// api
import * as api from 'src/services';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import AssignUsersModal from 'src/components/modals/assignUser';
const TABLE_HEAD = [
  { id: 'name', label: 'User', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false, sort: true },
  { id: 'items', label: 'items', alignRight: false },
  // { id: 'inventoryType', label: 'status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];
export default function OrdersAdminList({ isVendor, shops }) {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const [apicall, setApicall] = useState(false);
  const { data, isLoading: loadingList } = useQuery(
    ['orders', apicall, searchParams.toString()],
    () => api[isVendor ? 'getOrdersByVendor' : 'getOrdersByAdmin'](searchParams.toString()),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );
  const [open, setOpen] = useState(false);
  const [openAssignTo, setOpenAssignedTo] = useState(false);
  const [markUser, setMarkUser] = useState(null);

  const [id, setId] = useState(null);

  const { mutate: assignUserMutation, isLoading: assignLoading } = useMutation(
    isVendor ? null : api.updateAssignInOrderByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['orders']);
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

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMarkUser(null);
    setOpenAssignedTo(false);
  };

  async function openAssignUsers(row) {
    setMarkUser(row);
    setOpenAssignedTo(true);
  }

  const isLoading = loadingList;
  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteOrderByAdmin"
          type={'Order deleted'}
        />
      </Dialog>

      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderList}
        handleClickOpen={handleClickOpen}
        openAssignUsers={openAssignUsers}
        isVendor={isVendor}
        isSearch
        filters={
          isVendor
            ? []
            : [
                {
                  name: 'Shop',
                  param: 'shop',
                  data: shops
                }
              ]
        }
      />

      {/* Assign Users Modal */}
      {openAssignTo && (
        <AssignUsersModal
          open={openAssignTo}
          onClose={handleClose}
          markItem={markUser}
          assignLoading={assignLoading}
          onAssign={(payload) => assignUserMutation(payload)}
        />
      )}
    </>
  );
}
OrdersAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
