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
import Spin from 'src/components/table/rows/spin';

const TABLE_HEAD = [
  { id: 'box', label: 'Box', alignRight: false, sort: true },
  { id: 'influencer', label: 'Influencer', alignRight: false, sort: true },
  { id: 'item', label: 'Winning Item', alignRight: false, sort: true },

  { id: 'odd', label: 'Odd/Weight', alignRight: false, sort: true },

  { id: 'clientSeed', label: 'Client Seed', alignRight: false, sort: true },
  { id: 'serverSeed', label: 'Server Seed', alignRight: false, sort: true },
  { id: 'user', label: 'User', alignRight: false, sort: true },
  { id: 'date', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: false }
];

export default function AdminSpins() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['admin-spins', apicall, searchParam, pageParam],
    () => api.getSpinsByAdmin(+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong!')
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
          type={'Shop deleted'}
          deleteMessage={
            'Are you really sure you want to remove this Shop? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Spin}
        handleClickOpen={handleClickOpen}
        isSearch
      />
    </>
  );
}
AdminSpins.propTypes = {
  isVendor: PropTypes.boolean
};
