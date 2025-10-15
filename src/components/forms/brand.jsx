'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, Select, FormControl, FormHelperText, Skeleton } from '@mui/material';
import * as api from 'src/services';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import uploadToSpaces from 'src/utils/upload';
import parseMongooseError from 'src/utils/errorHandler';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'inactive'];

export default function BrandsForm({ data: currentBrand, isLoading: brandLoading }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { mutate, isLoading: submitting } = useMutation(currentBrand ? api.updateBrandByAdmin : api.addBrandByAdmin, {
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/admin/brands');
    },
    onError: (error) => {
      console.log(error, 'check the error');
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
        autoClose: false, // Prevents auto-dismissal
        closeOnClick: true // Allows clicking on the close icon
      });
    }
  });

  const BrandSchema = Yup.object().shape({
    name: Yup.string().required('Brand name is required'),
    logo: Yup.mixed().required('Logo is required'),
    description: Yup.string().required('Description is required')
  });

  const formik = useFormik({
    initialValues: {
      name: currentBrand?.name || '',
      logo: currentBrand?.logo || null,
      description: currentBrand?.description || '',
      status: currentBrand?.status || STATUS_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: BrandSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          ...(currentBrand && { currentSlug: currentBrand.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = async (acceptedFiles) => {
    setLoading(true);
    try {
      const filesWithPreview = acceptedFiles.map((file) => {
        Object.assign(file, { preview: URL.createObjectURL(file) });
        return file;
      });

      const uploads = await Promise.all(filesWithPreview.map((file) => uploadToSpaces(file)));

      const newImage = uploads[0];
      setFieldValue('logo', { _id: newImage?._id, url: newImage?.url });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Card sx={{ p: 3, mx: 'auto' }}>
            <Stack spacing={3}>
              {/* Brand Name */}
              <div>
                {brandLoading ? (
                  <Skeleton variant="text" width={140} />
                ) : (
                  <LabelStyle component="label" htmlFor="brand-name">
                    Brand Name
                  </LabelStyle>
                )}
                {brandLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    id="brand-name"
                    fullWidth
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                {brandLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <LabelStyle component="label" htmlFor="brand-description">
                    Description
                  </LabelStyle>
                )}
                {brandLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={240} />
                ) : (
                  <TextField
                    id="brand-description"
                    fullWidth
                    multiline
                    rows={6}
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <LabelStyle component="label" htmlFor="brand-image">
                    Brand Image
                  </LabelStyle>
                  <Typography variant="caption" color="text.secondary">
                    512 × 512
                  </Typography>
                </Stack>
                {brandLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={225} />
                ) : (
                  <UploadSingleFile
                    id="brand-image"
                    file={values.logo}
                    onDrop={handleDrop}
                    error={Boolean(touched.logo && errors.logo)}
                    accept="image/*"
                    loading={loading}
                  />
                )}
                {touched.logo && errors.logo && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {errors.logo}
                  </FormHelperText>
                )}
              </div>

              {/* Status */}
              <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                {brandLoading ? (
                  <Skeleton variant="text" width={70} />
                ) : (
                  <LabelStyle component="label" htmlFor="brand-status">
                    Status
                  </LabelStyle>
                )}
                {brandLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <Select
                    id="brand-status"
                    native
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                  >
                    <option value="" style={{ display: 'none' }} />
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                )}
                {touched.status && errors.status && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {errors.status}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Submit */}
              {brandLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={submitting}
                  sx={{ mt: 2, alignSelf: 'flex-end' }}
                >
                  {currentBrand ? 'Edit Brand' : 'Create Brand'}
                </LoadingButton>
              )}
            </Stack>
          </Card>
        </Form>
      </FormikProvider>
    </Box>
  );
}

BrandsForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
