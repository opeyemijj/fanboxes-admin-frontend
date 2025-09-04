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
import Role from 'src/components/table/rows/role';

const TABLE_HEAD = [
  { id: 'role', label: 'Role', alignRight: false, sort: true },
  { id: 'permissions', label: 'Permissions', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'action', label: 'Action', alignRight: true }
];
// ----------------------------------------------------------------------
export default function RoleList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['roles', apicall, searchParams.toString()],
    () => api['getRolesByAdmin'](searchParams.toString()),
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
          endPoint="deleteRoleByAdmin"
          type={'Role deleted'}
          deleteMessage={'Deleting this role will permanently remove it. Are you sure you want to proceed?'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Role}
        handleClickOpen={handleClickOpen}
        // isSearch
      />
    </>
  );
}
