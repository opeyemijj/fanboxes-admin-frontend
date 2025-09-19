'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider } from 'formik';
import dayjs from 'dayjs';

export default function OrderTrackingModal({ open, onClose, formik, loading, item }) {
  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>Tracking Info</DialogTitle>

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Tracking Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tracking"
                  fullWidth
                  {...getFieldProps('trackingNumber')}
                  error={Boolean(touched.trackingNumber && errors.trackingNumber)}
                  helperText={touched.trackingNumber && errors.trackingNumber}
                />
              </Grid>

              {/* Courier */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Courier"
                  fullWidth
                  {...getFieldProps('courier')}
                  error={Boolean(touched.courier && errors.courier)}
                  helperText={touched.courier && errors.courier}
                />
              </Grid>

              {/* Shipped Date */}
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
                />
              </Grid>

              {/* Expected Date */}
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
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {item?.trackingInfo ? 'Update' : 'Add'}
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}

OrderTrackingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  loading: PropTypes.bool
};
