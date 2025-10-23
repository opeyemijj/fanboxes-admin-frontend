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
import Item from 'src/components/table/rows/item';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false, sort: true },
  { id: 'sourceType', label: 'Source Type', alignRight: false, sort: true },
  { id: 'value', label: 'Item Value', alignRight: false, sort: true },
  { id: 'margin', label: 'Margin', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
// ----------------------------------------------------------------------
export default function ItemList() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['admin-items', apicall, searchParams.toString()],
    () => api.getItemsByAdmin(searchParams.toString()),
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
          endPoint="deleteItemByAdmin"
          type={'Item deleted'}
          deleteMessage={'Deleting this Item will permanently remove it. Are you sure you want to proceed?'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Item}
        handleClickOpen={handleClickOpen}
        isSearch
      />
    </>
  );
}
