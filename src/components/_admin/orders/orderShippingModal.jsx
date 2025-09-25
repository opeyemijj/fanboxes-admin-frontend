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
  MenuItem,
  FormHelperText,
  IconButton,
  Box,
  Paper
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider } from 'formik';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import Table from 'src/components/table/table';
import Shipping from 'src/components/table/rows/shipping';
import { capitalize } from 'lodash';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { SHIPPING_STATU } from 'src/utils/const';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export default function OrderShippingModal({ open, onClose, formik, loading, item }) {
  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue } = formik;
  const trackingInfo = item.trackingInfo;

  const tableData = {
    data: (item?.shippingInfo || []).slice().reverse()
  };

  const TABLE_HEAD = [
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'statsDate', label: 'Status Date', alignRight: false, sort: true },
    { id: 'statsComment', label: 'Status Comment', alignRight: false, sort: true }
  ];

  return (
    <Dialog scroll="paper" onClose={onClose} open={open} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 6 // leaves space so text doesn't clash with close icon
        }}
      >
        {/* Left side: Tracking Number */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            Tracking Number
          </Typography>
          <Typography fontWeight="bold">{trackingInfo?.trackingNumber}</Typography>
        </Box>

        {/* Right side: Recipient */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            Recipient
          </Typography>
          <Typography fontWeight="bold">
            {item?.user?.firstName} {item?.user?.lastName}
          </Typography>
        </Box>

        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Divider sx={{ mb: 3 }} />

        {/* Courier / Shipped / Expected */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Courier
            </Typography>
            <Typography fontWeight="bold">{trackingInfo?.courier}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Shipped
            </Typography>
            <Typography fontWeight="bold">{trackingInfo?.shipped}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Expected
            </Typography>
            <Typography fontWeight="bold">{trackingInfo?.expected}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Form Section */}
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Status */}
              <Grid item xs={12} md={4}>
                <LabelStyle>Status</LabelStyle>
                <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                  <Select {...getFieldProps('status')} displayEmpty>
                    <MenuItem value="">
                      <em>Select status</em>
                    </MenuItem>
                    {SortArrayAlphabetically(SHIPPING_STATU)?.map((status) => (
                      <MenuItem key={status} value={status}>
                        {capitalize(status)}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Status Date */}
              <Grid item xs={12} md={4}>
                <LabelStyle>Status Date</LabelStyle>
                <TextField
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={values.statusDate ? dayjs(values.statusDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
                  onChange={(e) => setFieldValue('statusDate', dayjs(e.target.value).format('DD/MM/YYYY'))}
                  error={Boolean(touched.statusDate && errors.statusDate)}
                  helperText={touched.statusDate && errors.statusDate}
                />
              </Grid>

              {/* Comment */}
              <Grid item xs={12} md={4}>
                <LabelStyle>Status Comment</LabelStyle>
                <TextField
                  fullWidth
                  placeholder="Add a note..."
                  {...getFieldProps('statusComment')}
                  error={Boolean(touched.statusComment && errors.statusComment)}
                  helperText={touched.statusComment && errors.statusComment}
                />
              </Grid>
            </Grid>

            <DialogActions style={{ padding: 0 }} sx={{ padding: 0 }}>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Add
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>

        <Divider sx={{ my: 3 }} />

        {/* Table Section */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Shipping History
        </Typography>
        <Table
          headData={TABLE_HEAD}
          data={tableData}
          isLoading={false}
          row={Shipping}
          isSearch={false}
          showRowCount={false}
          showPagination={false}
        />
      </DialogContent>
    </Dialog>
  );
}

OrderShippingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  loading: PropTypes.bool
};
