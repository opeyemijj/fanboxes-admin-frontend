'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, TextField, Typography, Box, Grid } from '@mui/material';

// yup
import * as Yup from 'yup';

// toast
import toast from 'react-hot-toast';

// formik
import { Form, FormikProvider, useFormik } from 'formik';

// dynamic import quill
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// api
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';

TermsForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function TermsForm({ data: currentTerms, isLoading: formLoading }) {
  const router = useRouter();

  // react-query mutation
  const { mutate, isLoading } = useMutation(
    currentTerms ? 'update' : 'new',
    currentTerms ? api.updatePaymentGateWayByAdmin : api.addStaticPageByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message || 'Saved successfully');
        if (currentTerms) {
          router.back();
        } else {
          router.push('/admin/static-page');
        }
      },
      onError: (error) => {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please try again.', {
          autoClose: false,
          closeOnClick: true
        });
      }
    }
  );

  // Validation
  const TermsSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(100, 'Max 100 characters'),
    htmlContent: Yup.string().required('Content is required')
  });

  const formik = useFormik({
    initialValues: {
      title: currentTerms?.title || '',
      htmlContent: currentTerms?.htmlContent || ''
    },
    enableReinitialize: true,
    validationSchema: TermsSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          ...(currentTerms && { id: currentTerms._id })
        });
      } catch (error) {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please try again.', {
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
                  {/* Title */}
                  <Grid item xs={12}>
                    <LabelStyle component="label" htmlFor="title">
                      Title
                    </LabelStyle>
                    <TextField
                      id="title"
                      fullWidth
                      {...getFieldProps('title')}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>

                  {/* HTML Editor */}
                  <Grid item xs={12}>
                    <LabelStyle component="label" htmlFor="htmlContent">
                      Terms & Conditions Content
                    </LabelStyle>
                    <ReactQuill
                      theme="snow"
                      value={values.htmlContent}
                      onChange={(val) => setFieldValue('htmlContent', val)}
                      style={{ height: '300px', marginBottom: '50px' }}
                    />
                    {touched.htmlContent && errors.htmlContent && (
                      <Typography variant="caption" color="error">
                        {errors.htmlContent}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Submit button */}
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" size="large" loading={isLoading}>
                {currentTerms ? 'Edit' : 'Create'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
