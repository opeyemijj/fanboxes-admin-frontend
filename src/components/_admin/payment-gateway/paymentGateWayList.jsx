'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import PaymentGateWay from 'src/components/table/rows/paymentGateWay';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false },
  { id: 'primaryKey', label: 'Primary Key', alignRight: false },
  { id: 'otherKey1', label: 'Other Key 1', alignRight: false },
  { id: 'otherKey2', label: 'Other Key 2', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
// ----------------------------------------------------------------------
export default function PaymentGateWayList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['payment-gate-ways', apicall, searchParams.toString()],
    () => api.getPaymentGateWaysByAdmin(searchParams.toString()),
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
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteConversionByAdmin"
          type={'Conversion deleted'}
          deleteMessage={'Deleting this conversion will permanently remove it. Are you sure you want to proceed?'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={PaymentGateWay}
        handleClickOpen={handleClickOpen}
        // isSearch
      />
    </>
  );
}
