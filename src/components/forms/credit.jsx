'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton
} from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// yup
import * as Yup from 'yup';
// axios
import axios from 'axios';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';

CreditForm.propTypes = {
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
const CONVERSION_TYPE_OPTIONS = ['base', 'refund', 'shipping'];
const VALUE_TYPE_OPTIONS = ['number', 'percentage'];

export default function CreditForm({ data: currentConversion, isLoading: creditLoading }) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    currentConversion ? 'update' : 'new',
    currentConversion ? api.updateCategoryByAdmin : api.addCreditByAdmin,
    {
      ...(currentConversion && {
        enabled: Boolean(currentConversion)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);

        router.push('/admin/credits');
      },
      onError: (error) => {
        console.log(error, 'check the error');
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  );
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });
  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Name max character limit is 50'),
    type: Yup.string().required('Type is required'),
    value: Yup.number().required('Value is required'),
    valueType: Yup.string().required('Value is required')
  });

  const formik = useFormik({
    initialValues: {
      name: currentConversion?.name || '',
      value: currentConversion?.value || '',
      type: currentConversion?.type || CONVERSION_TYPE_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: NewCategorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentConversion && {
            currentSlug: currentConversion.slug
          })
        });
      } catch (error) {
        console.error(error);
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    {/* Name Field */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        {creditLoading ? (
                          <Skeleton variant="text" width={140} />
                        ) : (
                          <LabelStyle component="label" htmlFor="conversion-name">
                            Name
                          </LabelStyle>
                        )}

                        {creditLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="conversion-name"
                            fullWidth
                            {...getFieldProps('name')}
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                          />
                        )}
                      </Stack>
                    </Grid>

                    {/* Conversion Type Field */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        {creditLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component="label" htmlFor="type">
                            Conversion Type
                          </LabelStyle>
                        )}

                        {creditLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                            <Select
                              id="type"
                              native
                              {...getFieldProps('type')}
                              error={Boolean(touched.type && errors.type)}
                            >
                              <option value="" style={{ display: 'none' }} />
                              {CONVERSION_TYPE_OPTIONS?.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Select>
                            {touched.type && errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
                          </FormControl>
                        )}
                      </Stack>
                    </Grid>

                    {/* value Field */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        {creditLoading ? (
                          <Skeleton variant="text" width={140} />
                        ) : (
                          <LabelStyle component="label" htmlFor="conversion-value">
                            Value
                          </LabelStyle>
                        )}

                        {creditLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="conversion-value"
                            fullWidth
                            {...getFieldProps('value')}
                            error={Boolean(touched.value && errors.value)}
                            helperText={touched.value && errors.value}
                          />
                        )}
                      </Stack>
                    </Grid>

                    {/* Value Field */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        {creditLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component="label" htmlFor="value-type">
                            Value Type
                          </LabelStyle>
                        )}

                        {creditLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                            <Select
                              id="value-type"
                              native
                              {...getFieldProps('valueType')}
                              error={Boolean(touched.valueType && errors.valueType)}
                            >
                              <option value="" style={{ display: 'none' }} />
                              {VALUE_TYPE_OPTIONS?.map((valueType) => (
                                <option key={valueType} value={valueType}>
                                  {valueType}
                                </option>
                              ))}
                            </Select>
                            {touched.valueType && errors.valueType && (
                              <FormHelperText error>{errors.valueType}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Grid>

            {creditLoading ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
                sx={{ ml: 'auto', mt: 3 }}
              >
                {currentConversion ? 'Edit Conferstion' : 'Create Conversion'}
              </LoadingButton>
            )}
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
