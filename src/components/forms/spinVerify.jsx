'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, Grid, Skeleton } from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// yup
import * as Yup from 'yup';
// axios
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';

CategoryForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'deactive'];

export default function CategoryForm({ spinItem, isLoading: categoryLoading }) {
  const router = useRouter();
  const [verifiedResult, setVerifiedResult] = useState();

  const { mutate, isLoading } = useMutation(api.verifySpinByAdmin, {
    ...(spinItem && {
      enabled: Boolean(spinItem)
    }),
    retry: false,
    onSuccess: (data) => {
      console.log(data, 'Check the data');
      setVerifiedResult(data?.data);
      toast.success(data.message);

      // router.push('/admin/categories');
    },
    onError: (error) => {
      setVerifiedResult(null);
      toast.error(error.response.data.message);
    }
  });

  const VerifySpinSchema = Yup.object().shape({
    serverSeed: Yup.string().required('Server seed is required'),
    clientSeed: Yup.string().required('Client seed required'),
    nonce: Yup.number().required('Nonce is required')
  });

  const formik = useFormik({
    initialValues: {
      serverSeed: spinItem?.serverSeed || '',
      clientSeed: spinItem?.clientSeed || '',
      nonce: spinItem?.nonce || ''
    },
    enableReinitialize: true,
    validationSchema: VerifySpinSchema,
    onSubmit: async (values) => {
      setVerifiedResult(null);
      console.log(values, 'check the values');
      const { ...rest } = values;
      try {
        mutate({
          ...spinItem,
          ...rest
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Server Seed'}{' '}
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="server-seed"
                        fullWidth
                        {...getFieldProps('serverSeed')}
                        error={Boolean(touched.serverSeed && errors.serverSeed)}
                        helperText={touched.serverSeed && errors.serverSeed}
                      />
                    )}
                  </div>

                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="client-seed">
                        {' '}
                        {'Client Seed'}{' '}
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="client-seed"
                        fullWidth
                        {...getFieldProps('clientSeed')}
                        error={Boolean(touched.clientSeed && errors.clientSeed)}
                        helperText={touched.clientSeed && errors.clientSeed}
                      />
                    )}
                  </div>

                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="nonce">
                        {' '}
                        {'Nonce'}{' '}
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="nonce"
                        fullWidth
                        {...getFieldProps('nonce')}
                        error={Boolean(touched.nonce && errors.nonce)}
                        helperText={touched.nonce && errors.nonce}
                      />
                    )}
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <LabelStyle component={'label'} htmlFor="server-seed">
                      {' '}
                      {'Box Name'}{' '}
                    </LabelStyle>
                    <TextField value={spinItem?.boxDetails?.name} fullWidth />
                  </div>

                  <div>
                    <LabelStyle component={'label'} htmlFor="server-seed">
                      {' '}
                      {'Wining Item'}{' '}
                    </LabelStyle>
                    <TextField value={spinItem?.winningItem?.name} fullWidth />
                  </div>

                  <div>
                    <LabelStyle component={'label'} htmlFor="server-seed">
                      {' '}
                      {'Odd/Weight'}
                      {}
                    </LabelStyle>
                    <TextField
                      value={spinItem?.winningItem?.odd + '/' + spinItem?.winningItem?.weight + '%'}
                      fullWidth
                    />
                  </div>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          <div>
            {categoryLoading ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
                sx={{ ml: 'auto', mt: 3 }}
              >
                Verify Result
              </LoadingButton>
            )}
          </div>

          {verifiedResult && (
            <Grid mt={3} container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Hash'}{' '}
                      </LabelStyle>
                      <TextField value={verifiedResult?.hash} fullWidth />
                    </div>

                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Normalized Value'}{' '}
                      </LabelStyle>
                      <TextField value={verifiedResult?.normalized} fullWidth />
                    </div>

                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Wining Item'}{' '}
                      </LabelStyle>
                      <TextField value={verifiedResult?.winningItem?.name} fullWidth />
                    </div>

                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Item Value'}{' '}
                      </LabelStyle>
                      <TextField value={`$ ${verifiedResult?.winningItem?.value}`} fullWidth />
                    </div>

                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Odd/Weight'}
                        {}
                      </LabelStyle>
                      <TextField
                        value={spinItem?.winningItem?.odd + '/' + spinItem?.winningItem?.weight + '%'}
                        fullWidth
                      />
                    </div>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        Influencer
                      </LabelStyle>
                      <TextField
                        value={`${verifiedResult?.vendorDetails?.firstName} ${verifiedResult?.vendorDetails?.lastName}`}
                        fullWidth
                      />
                    </div>

                    <div>
                      <LabelStyle component={'label'} htmlFor="server-seed">
                        {' '}
                        {'Box'}{' '}
                      </LabelStyle>
                      <TextField value={verifiedResult?.boxDetails?.name} fullWidth />
                    </div>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Form>
      </FormikProvider>
    </Box>
  );
}
