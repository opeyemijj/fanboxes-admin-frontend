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
const TABLE_HEAD = [
  { id: 'orderNo', label: 'Order No', alignRight: false },
  { id: 'items', label: 'items', alignRight: false },
  { id: 'name', label: 'User', alignRight: false },
  { id: 'transaction', label: 'Transaction Category', alignRight: false, sort: true },
  { id: 'transactionAmount', label: 'Amount', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false, sort: true },
  { id: 'transactionStatus', label: 'Transaction Status', alignRight: false, sort: true },
  { id: 'totalAmountPaid', label: 'Amount Paid', alignRight: false, sort: true },

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
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  const [open, setOpen] = useState(false);
  const [openTraking, setOpenTraking] = useState(false);

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

  // ✅ Yup Validation Schema
  // ✅ Yup Validation Schema
  const TrackingSchema = Yup.object().shape({
    tracking: Yup.string()
      .required('Tracking number is required')
      .max(8, 'Tracking should be 8 character')
      .min(8, 'Tracking should be 8 character'),
    courier: Yup.string().required('Courier name is required'),
    shipped: Yup.date().required('Shipped date is required'),
    expected: Yup.date().required('Expected date is required')
  });

  dayjs.extend(customParseFormat);
  const today = dayjs().format('YYYY-MM-DD');
  const formik = useFormik({
    initialValues: {
      tracking: '',
      courier: '',
      shipped: null,
      expected: null
    },
    validationSchema: TrackingSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Format date before submit
        const payload = {
          ...values,
          shipped: dayjs(values.shipped).format('DD/MM/YYYY'),
          expected: dayjs(values.expected).format('DD/MM/YYYY')
        };
        console.log('Submitted values:', payload);

        toast.success('Tracking info added!');
        resetForm();
        handleClose();
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue, values, resetForm } = formik;

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMarkOrder(null);
    setOpenAssignedTo(false);
    setOpenTraking(false);
    resetForm();
  };

  async function openAssignUsers(row) {
    setMarkOrder(row);
    setOpenAssignedTo(true);
  }

  function handleClickOpenTraking(prop) {
    console.log('Come here', prop);
    // setMarkOrder(prop);
    setOpenTraking(true);
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
        handleClickOpenTraking={handleClickOpenTraking}
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
          markItem={markOrder}
          assignLoading={assignLoading}
          onAssign={(payload) => assignUserMutation(payload)}
        />
      )}

      {/* Traking Moal */}

      <Dialog onClose={handleClose} open={openTraking} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>Tracking Info</DialogTitle>

        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogContent>
              {/* <DialogContentText sx={{ mb: 2 }}>Add Tracking info</DialogContentText> */}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Traking */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tracking"
                        fullWidth
                        {...getFieldProps('tracking')}
                        error={Boolean(touched.tracking && errors.tracking)}
                        helperText={touched.tracking && errors.tracking}
                      />
                    </Grid>

                    {/* Highlight */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Courier"
                        fullWidth
                        {...getFieldProps('courier')}
                        error={Boolean(touched.courier && errors.courier)}
                        helperText={touched.courier && errors.courier}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Shipped"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={values.shipped ? dayjs(values.shipped, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
                        onChange={(e) => setFieldValue('shipped', dayjs(e.target.value).format('DD/MM/YYYY'))}
                        error={Boolean(touched.shipped && errors.shipped)}
                        helperText={touched.shipped && errors.shipped}
                        // inputProps={{ min: today }} // ✅ restrict past dates
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Expected"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={values.expected ? dayjs(values.expected, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
                        onChange={(e) => setFieldValue('expected', dayjs(e.target.value).format('DD/MM/YYYY'))}
                        error={Boolean(touched.expected && errors.expected)}
                        helperText={touched.expected && errors.expected}
                        // inputProps={{ min: today }} // ✅ restrict past dates
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Cancel
              </Button>

              <LoadingButton type="submit" variant="contained" loading={false}>
                Add
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
}
OrdersAdminList.propTypes = {
  isVendor: PropTypes.boolean
};
