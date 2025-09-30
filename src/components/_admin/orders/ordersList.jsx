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
import OrderTrackingModal from './orderTrackingModal';
import OrderShippingModal from './orderShippingModal';
import { SHIPPING_STATU, SHIPPING_STATUS_FOR_FILTER } from 'src/utils/const';
import { SortArrayAlphabetically } from 'src/utils/sorting';
const TABLE_HEAD = [
  { id: 'orderNo', label: 'Order No', alignRight: false },
  { id: 'items', label: 'item', alignRight: false },
  { id: 'name', label: 'User', alignRight: false },
  { id: 'transaction', label: 'Transaction Type', alignRight: false, sort: true },
  { id: 'transactionAmount', label: 'Amount', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false, sort: true },

  { id: 'inventoryType', label: 'status', alignRight: false, sort: true },
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
      onError: (err) => toast.error(err.message || 'Something went wrong!')
    }
  );

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const [openAssignTo, setOpenAssignedTo] = useState(false);
  const [markOrder, setMarkOrder] = useState(null);

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
      .max(8, 'Tracking should be 8 character')
      .min(8, 'Tracking should be 8 character'),
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
  };

  async function openAssignUsers(row) {
    setMarkOrder(row);
    setModalType('assign');
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

  function UpdateSelectedRow(id) {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
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
        UpdateSelectedRow={UpdateSelectedRow}
        handleClickOpen={handleClickOpen}
        openAssignUsers={openAssignUsers}
        handleClickOpenTraking={handleClickOpenTraking}
        handleClickOpenShipping={handleClickOpenShipping}
        isVendor={isVendor}
        isSearch
        bulkAction={[
          {
            actionName: 'Assign',
            action: (selectedRows) => {
              console.log('Assign called for rows:', selectedRows);
            }
          },
          {
            actionName: 'Delete',
            action: (selectedRows) => {
              console.log('Delete called for rows:', selectedRows);
            }
          }
        ]}
        selectedRows={selectedRows}
        filters={[
          {
            name: 'Status',
            param: 'status',
            data: SortArrayAlphabetically(SHIPPING_STATUS_FOR_FILTER, 'name')
          }
        ]}
      />

      {/* Assign Users Modal */}
      {modalType === 'assign' && (
        <AssignUsersModal
          open={modalType === 'assign'}
          onClose={handleClose}
          markItem={markOrder}
          assignLoading={assignLoading}
          onAssign={(payload) => assignUserMutation(payload)}
        />
      )}

      {/* Traking Moal */}

      {modalType === 'tracking' && (
        <OrderTrackingModal
          open={modalType === 'tracking'}
          onClose={handleClose}
          formik={trackingFormik}
          loading={trackingLoading}
          item={markOrder}
        />
      )}

      {modalType === 'shipping' && (
        <OrderShippingModal
          open={modalType === 'shipping'}
          onClose={handleClose}
          formik={shippingFormik}
          loading={shippingLoading}
          item={markOrder}
        />
      )}
    </>
  );
}
OrdersAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
