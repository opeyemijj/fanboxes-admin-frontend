'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Transection from 'src/components/table/rows/transection';

const TABLE_HEAD = [
  { id: 'type', label: 'Type', alignRight: false, sort: true },
  { id: 'user', label: 'User', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false, sort: true },
  { id: 'amount', label: 'Amount', alignRight: false, sort: true },
  { id: 'description', label: 'Description', alignRight: false, sort: true },
  { id: 'reference', label: 'Reference', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'date', label: 'date', alignRight: false, sort: true }
];

export default function AdminTransections() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['transections', apicall, searchParams.toString()],
    () => api.getTransectionsByAdmin(searchParams.toString()),
    {
      onError: (err) => toast.error(err.message || 'Something went wrong!')
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
          endPoint={'deleteShop'}
          type={'Influencer deleted'}
          deleteMessage={
            'Are you really sure you want to remove this Shop? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Transection}
        handleClickOpen={handleClickOpen}
        // isSearch
      />
    </>
  );
}
