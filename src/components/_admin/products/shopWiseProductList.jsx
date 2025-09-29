'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
// api
import * as api from 'src/services';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import parseMongooseError from 'src/utils/errorHandler';
import AssignUsersModal from 'src/components/modals/assignUser';

const TABLE_HEAD = [
  { id: 'name', label: 'Box', alignRight: false, sort: true },
  { id: 'influencer', label: 'Influencer', alignRight: false, sort: true },
  { id: 'owner', label: 'Owner', alignRight: false, sort: true },
  { id: 'visitedCount', label: 'Total Visit', alignRight: false, sort: true },
  { id: 'items', label: 'Items', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date Created', alignRight: false, sort: true },
  { id: 'inventoryType', label: 'Status', alignRight: false, sort: false }
];
export default function AdminShopWiseProducts({ data, isLoading }) {
  // Handle user checkbox toggle

  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={data ?? { success: true, data: [], total: 0, count: 0, currentPage: 1 }}
        isLoading={isLoading}
        row={Product}
        handleClickOpenStatus={null}
        handleClickOddsVisibility={null}
        oddsVisibileLoading={null}
        handleClickOpenBanned={null}
        isSearch={false}
      />
    </>
  );
}
