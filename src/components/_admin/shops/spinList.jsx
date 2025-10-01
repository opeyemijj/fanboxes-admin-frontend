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

export default function AdminSpins({ searchBy }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // always set searchBy (replace if exists, add if not)
  if (searchBy) {
    params.set(searchBy.key, searchBy.value);
  }

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['admin-spins', apicall, params.toString()],
    () => api.getSpinsByAdmin(params.toString()),
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
        row={Spin}
        handleClickOpen={handleClickOpen}
        isSearch={!searchBy ? true : false}
      />
    </>
  );
}
AdminSpins.propTypes = {
  isVendor: PropTypes.boolean
};
