'use client';
import React from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, TextField, Typography, Box, Select, FormControl, FormHelperText, Grid } from '@mui/material';

// yup
import * as Yup from 'yup';

// toast
import toast from 'react-hot-toast';

// formik
import { Form, FormikProvider, useFormik } from 'formik';

// api
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';

PaymentGateForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

// Payment Methods
const PAYMENT_METHOD_OPTIONS = ['Card', 'Crypto'];

export default function PaymentGateForm({ data: currentGateway, isLoading: formLoading }) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    currentGateway ? 'update' : 'new',
    currentGateway ? api.updatePaymentGateWayByAdmin : api.addPaymentGatewayByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        if (currentGateway) {
          router.back();
        } else {
          router.push('/admin/payment-gateway');
        }
      },
      onError: (error) => {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false,
          closeOnClick: true
        });
      }
    }
  );

  // Validation
  const PaymentSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Name max character limit is 50'),
    primaryKey: Yup.string()
      .min(10, 'Primary sould be 10 char lengthe')
      .max(10, 'Primary sould be 10 char lengthe')
      .required('Primary Key is required'),
    secretKey: Yup.string()
      .required('Secret Key is required')
      .min(10, 'Secret sould be 10 char lengthe')
      .max(10, 'Secret sould be 10 char lengthe'),
    paymentMethod: Yup.string().required('Payment Method is required'),
    otherKey1: Yup.string().nullable(),
    otherKey2: Yup.string().nullable()
  });

  const formik = useFormik({
    initialValues: {
      name: currentGateway?.name || '',
      primaryKey: currentGateway?.primaryKey || '',
      secretKey: currentGateway?.secretKey || '',
      paymentMethod: currentGateway?.paymentMethod || PAYMENT_METHOD_OPTIONS[0],
      otherKey1: currentGateway?.otherKeys?.[0] || '',
      otherKey2: currentGateway?.otherKeys?.[1] || ''
    },
    enableReinitialize: true,
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          otherKeys: [values.otherKey1, values.otherKey2].filter(Boolean),
          ...(currentGateway && { currentSlug: currentGateway.slug })
        });
      } catch (error) {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false,
          closeOnClick: true
        });
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="name">
                      Name
                    </LabelStyle>
                    <TextField
                      id="name"
                      fullWidth
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  {/* Primary Key */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="primaryKey">
                      Primary Key
                    </LabelStyle>
                    <TextField
                      id="primaryKey"
                      fullWidth
                      {...getFieldProps('primaryKey')}
                      error={Boolean(touched.primaryKey && errors.primaryKey)}
                      helperText={touched.primaryKey && errors.primaryKey}
                    />
                  </Grid>

                  {/* Secret Key */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="secretKey">
                      Secret Key
                    </LabelStyle>
                    <TextField
                      id="secretKey"
                      fullWidth
                      {...getFieldProps('secretKey')}
                      error={Boolean(touched.secretKey && errors.secretKey)}
                      helperText={touched.secretKey && errors.secretKey}
                    />
                  </Grid>

                  {/* Payment Method */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="paymentMethod">
                      Payment Method
                    </LabelStyle>
                    <FormControl fullWidth error={Boolean(touched.paymentMethod && errors.paymentMethod)}>
                      <Select
                        id="paymentMethod"
                        native
                        value={values.paymentMethod}
                        onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {PAYMENT_METHOD_OPTIONS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </Select>
                      {touched.paymentMethod && errors.paymentMethod && (
                        <FormHelperText>{errors.paymentMethod}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Other Key 1 */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="otherKey1">
                      Other Key 1
                    </LabelStyle>
                    <TextField
                      id="otherKey1"
                      fullWidth
                      {...getFieldProps('otherKey1')}
                      error={Boolean(touched.otherKey1 && errors.otherKey1)}
                      helperText={touched.otherKey1 && errors.otherKey1}
                    />
                  </Grid>

                  {/* Other Key 2 */}
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="otherKey2">
                      Other Key 2
                    </LabelStyle>
                    <TextField
                      id="otherKey2"
                      fullWidth
                      {...getFieldProps('otherKey2')}
                      error={Boolean(touched.otherKey2 && errors.otherKey2)}
                      helperText={touched.otherKey2 && errors.otherKey2}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Submit button aligned right */}
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" size="large" loading={isLoading}>
                {currentGateway ? 'Edit' : 'Create'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
