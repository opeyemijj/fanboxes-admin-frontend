'use client';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  Typography,
  styled,
  Select,
  FormHelperText
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider } from 'formik';
import dayjs from 'dayjs';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function OrderShippingModal({ open, onClose, formik, loading, item }) {
  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue } = formik;
  const trackingInfo = item.trackingInfo;

  const SHIPPING_STATU = [
    'pending', // Order placed, waiting to be processed
    'processing', // Payment confirmed, preparing for shipment
    'shipped', // Package handed over to statusComment
    'in transit', // Courier is transporting the package
    'out for delivery', // Package is with delivery agent
    'delivered', // Successfully delivered to recipient
    'delayed', // Shipment delayed due to issues
    'returned', // Customer returned the order
    'cancelled', // Order cancelled before shipping/delivery
    'failed delivery' // Courier attempted but delivery failed
  ];

  return (
    <Dialog onClose={onClose} open={open} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        <span>Tracking Number: {trackingInfo?.trackingNumber}</span>
        <span>Recipient: {item?.user?.firstName + ' ' + item?.user?.lastName}</span>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'flex-start', md: 'space-between' },
          gap: 2 // spacing between items
        }}
      >
        <span>Courier: {trackingInfo?.courier}</span>
        <span>Shipped: {trackingInfo?.shipped}</span>
        <span>Expected: {trackingInfo?.expected}</span>
      </DialogContent>

      <Divider />

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Tracking Number */}
              <Grid item xs={12} md={6}>
                <LabelStyle component="label" htmlFor="status">
                  Status
                </LabelStyle>
                <FormControl fullWidth sx={{ textTransform: 'capitalize' }}>
                  <Select
                    id="status"
                    native
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                  >
                    <option value="" style={{ display: 'none' }} />
                    {SHIPPING_STATU.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                  {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Shipped Date */}
              <Grid item xs={12} md={6}>
                <LabelStyle component="label" htmlFor="status-date">
                  Status
                </LabelStyle>
                <TextField
                  id="status-date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={values.statusDate ? dayjs(values.statusDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
                  onChange={(e) => setFieldValue('statusDate', dayjs(e.target.value).format('DD/MM/YYYY'))}
                  error={Boolean(touched.statusDate && errors.statusDate)}
                  helperText={touched.statusDate && errors.statusDate}
                />
              </Grid>

              {/* Courier */}
              <Grid item xs={12} md={12}>
                <LabelStyle component="label" htmlFor="status-comment">
                  Status Comment
                </LabelStyle>
                <TextField
                  id="status-comment"
                  fullWidth
                  {...getFieldProps('statusComment')}
                  error={Boolean(touched.statusComment && errors.statusComment)}
                  helperText={touched.statusComment && errors.statusComment}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Add Shipment
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}

OrderShippingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  loading: PropTypes.bool
};
