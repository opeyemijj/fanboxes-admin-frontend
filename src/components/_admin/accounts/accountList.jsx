'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import AccountList from 'src/components/table/rows/accountList';
import DeleteDialog from 'src/components/dialog/delete';
import PropTypes from 'prop-types';
// mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Card, Stack, TextField, Typography, Box, FormHelperText, Grid } from '@mui/material';
// api
import * as api from 'src/services';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import AssignUsersModal from 'src/components/modals/assignUser';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// formik
import { Form, FormikProvider, useFormik } from 'formik';
import parseMongooseError from 'src/utils/errorHandler';
import { SHIPPING_STATU, SHIPPING_STATUS_FOR_FILTER } from 'src/utils/const';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { UsePermission } from 'src/hooks/usePermission';
const TABLE_HEAD = [
  { id: 'box', label: 'Box', alignRight: false },
  { id: 'items', label: 'item', alignRight: false },
  { id: 'itemPrice', label: 'Item Price', alignRight: false },
  { id: 'amount', label: 'Paid Amount', alignRight: false },
  { id: 'influencer_amount', label: 'Influencer Comm', alignRight: false },
  { id: 'fanboxes_amount', label: 'Fanboxes Comm', alignRight: false },
  { id: 'margin', label: 'Margin', alignRight: false },
  { id: 'transaction', label: 'Transaction Type', alignRight: false, sort: true }
  // { id: '', label: 'actions', alignRight: true }
];
export default function AccountsAdminList({ isVendor, shops, searchBy }) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  // always set searchBy (replace if exists, add if not)
  if (searchBy && searchBy.length > 0) {
    for (let i = 0; i < searchBy.length; i++) {
      params.set(searchBy[i].key, searchBy[i].value);
    }
  }

  const queryClient = useQueryClient();

  const [apicall, setApicall] = useState(false);
  const { data, isLoading: loadingList } = useQuery(
    ['accounts', apicall, params.toString()],
    () => api[isVendor ? 'getOrdersByVendor' : 'getAccountsByAdmin'](params.toString()),
    {
      onError: (err) => toast.error(err.message || 'Something went wrong!')
    }
  );

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const [markOrder, setMarkOrder] = useState(null);

  const [id, setId] = useState(null);

  const { mutate: assignUserMutation, isLoading: assignLoading } = useMutation(
    modalType === 'assignSelectedRecords' ? api.updateMulitpleAssignInOrderByAdmin : api.updateAssignInOrderByAdmin,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error) => {
        console.log(error, 'mutation error');
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  const { mutate: trackingMutation, isLoading: trackingLoading } = useMutation(
    isVendor ? null : api.updateTrackingInOrderByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error) => {
        console.log(error, 'is it error');
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  const { mutate: shippingMutation, isLoading: shippingLoading } = useMutation(
    isVendor ? null : api.updateShippingInOrderByAdmin, // mutation function here
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setMarkOrder(data.data);
        shippingFormik.resetForm();
        // handleClose();
        // ✅ Refetch products list
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error) => {
        console.log(error, 'is it error');
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );

  // ✅ Yup Validation Schema
  // ✅ Yup Validation Schema
  const TrackingSchema = Yup.object().shape({
    trackingNumber: Yup.string()
      .required('Tracking number is required')
      .min(8, 'Tracking should be 8 character at least'),
    courier: Yup.string().required('Courier name is required'),
    shipped: Yup.string().required('Shipped date is required'),
    expected: Yup.string().required('Expected date is required')
  });

  const ShippingSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    statusDate: Yup.string().required('Status date is required')
  });

  dayjs.extend(customParseFormat);
  const today = dayjs().format('YYYY-MM-DD');
  const trackingFormik = useFormik({
    initialValues: {
      trackingNumber: '',
      courier: '',
      shipped: null,
      expected: null
    },
    validationSchema: TrackingSchema,
    onSubmit: async (values, { resetTrackingForm }) => {
      try {
        const { ...rest } = values;
        trackingMutation({
          slug: markOrder._id,
          ...rest
        });
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  });

  const shippingFormik = useFormik({
    initialValues: {
      status: 'pending',
      statusDate: null,
      statusComment: ''
    },
    validationSchema: ShippingSchema,
    onSubmit: async (values) => {
      try {
        const { ...rest } = values;
        shippingMutation({
          slug: markOrder._id,
          ...rest
        });
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  });

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMarkOrder(null);
    shippingFormik.resetForm();
    trackingFormik.resetForm();
    setModalType('');
    setSelectedRows([]);
  };

  async function openAssignUsers(row) {
    setMarkOrder(row);
    setModalType('assign');
  }

  async function openAssignUsersForSelectedRecords() {
    setModalType('assignSelectedRecords');
  }

  function handleClickOpenTraking(prop) {
    setMarkOrder(prop);
    setModalType('tracking');

    // Prefill Formik values if trackingInfo exists
    if (prop.trackingInfo) {
      const info = prop.trackingInfo;
      trackingFormik.setValues({
        trackingNumber: info.trackingNumber || '',
        courier: info.courier || '',
        shipped: info.shipped || '',
        expected: info.expected || ''
      });
    } else {
      trackingFormik.resetForm();
    }
  }

  function handleClickOpenShipping(prop) {
    setMarkOrder(prop);
    setModalType('shipping');
  }

  function UpdateSelectedRow(id, type, checkType) {
    if (type === 'single') {
      setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    } else if (type === 'all') {
      if (checkType) {
        // ✅ Select all IDs
        const allIds = data?.data?.map((item) => item._id) || [];
        setSelectedRows(allIds);
      } else {
        // ✅ Deselect all
        setSelectedRows([]);
      }
    }
  }

  const isLoading = loadingList;
  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={AccountList}
        isVendor={isVendor}
        isSearch={searchBy ? false : true}
      />
    </>
  );
}
AccountsAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
