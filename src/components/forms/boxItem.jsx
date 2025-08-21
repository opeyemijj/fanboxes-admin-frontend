'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { capitalCase } from 'change-case';
import { useRouter } from 'next-nprogress-bar';

import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Switch,
  InputAdornment
} from '@mui/material';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
import axios from 'axios';

// components
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { fCurrency } from 'src/utils/formatNumber';
import uploadToSpaces from 'src/utils/upload';
// ----------------------------------------------------------------------

const GENDER_OPTION = ['men', 'women', 'kids', 'others'];
const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,

  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function AddItemForm({ currentProduct, isInitialized = false, isVendor, boxDetails }) {
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
  const { mutate, isLoading: updateLoading } = useMutation(
    currentProduct ? 'update' : 'new',
    currentProduct
      ? isVendor
        ? api.updateItemBoxByAdmin
        : api.updateItemBoxByAdmin
      : isVendor
        ? api.createVendorBoxItem
        : api.createVendorBoxItem,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        router.push((isVendor ? '/vendor' : '/admin') + '/products' + '/box' + `/${boxDetails?.slug}`);
      },
      onError: (error) => {
        console.log(error, 'Check the error');
        toast.error(error.response.data.message);
      }
    }
  );
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    value: Yup.string().required('Item value is required'),
    weight: Yup.number().max(100, 'Max Limit 100').required('Item weight is required'),
    odd: Yup.number().max(1, 'Max Limit 1').required('Item odd is required'),
    description: Yup.string().required('Description is required'),
    slug: Yup.string().required('Slug is required'),
    images: Yup.array().min(1, 'Image is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      boxSlug: boxDetails?.slug || '',
      slug: currentProduct?.slug || '',
      value: currentProduct?.value || '',
      weight: currentProduct?.weight || '',
      odd: currentProduct?.odd || '',
      images: currentProduct?.images || [],
      blob: currentProduct?.blob || []
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentProduct && { currentSlug: currentProduct.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  function convertWeightOdd({ weight = null, odd = null }) {
    if (weight !== null && odd === null) {
      // Convert weight → odd
      const convertedOdd = weight / 100;
      setFieldValue('odd', convertedOdd);
    } else if (odd !== null && weight === null) {
      // Convert odd → weight
      const convertedWeight = odd * 100;
      setFieldValue('weight', convertedWeight);
    } else {
      throw new Error('Pass either weight or odd, not both.');
    }
  }

  const handleDrop = async (acceptedFiles) => {
    setloading(true);

    try {
      // Add previews for each file
      const filesWithPreview = acceptedFiles.map((file) => {
        Object.assign(file, { preview: URL.createObjectURL(file) });
        return file;
      });

      // Update blob state immediately
      setFieldValue('blob', values.blob.concat(filesWithPreview));

      // Upload all files in parallel using uploadToSpaces
      const uploads = await Promise.all(
        filesWithPreview.map((file) =>
          uploadToSpaces(file, (progress) => {
            // Optional: You can show total progress if needed
            console.log(`Uploading ${file.name}: ${progress}%`);
          })
        )
      );

      // Format uploaded data
      const newImages = uploads.map((uploaded) => ({
        url: uploaded.url,
        _id: uploaded._id
      }));

      // Merge with existing images
      setFieldValue('images', values.images.concat(newImages));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setloading(false);
    }
  };

  // handleAddVariants

  // handleRemoveAll
  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
  };
  // handleRemove
  const handleRemove = (file) => {
    const removeImage = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue('images', removeImage);
  };

  const handleTitleChange = (event) => {
    if (!currentProduct) {
      const title = event.target.value;
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
      formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    }
    formik.handleChange(event); // handle the change in formik
  };
  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      {isInitialized ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="product-name">
                          {'Item Name'}
                        </LabelStyle>
                      )}
                      {isInitialized ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="product-name"
                          fullWidth
                          {...getFieldProps('name')}
                          onChange={handleTitleChange} // add onChange handler for title
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <div>
                              {isInitialized ? (
                                <Skeleton variant="text" width={140} />
                              ) : (
                                <LabelStyle component={'label'} htmlFor="weight">
                                  {'Weight'}
                                </LabelStyle>
                              )}
                              {isInitialized ? (
                                <Skeleton variant="rectangular" width="100%" height={56} />
                              ) : (
                                <TextField
                                  id="weight"
                                  fullWidth
                                  {...getFieldProps('weight')}
                                  error={Boolean(touched.weight && errors.weight)}
                                  helperText={touched.weight && errors.weight}
                                  InputProps={{
                                    type: 'number'
                                  }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    convertWeightOdd({ weight: value, factor: 2 });
                                    getFieldProps('weight').onChange(e); // 👈 still update Formik state
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <div>
                              {isInitialized ? (
                                <Skeleton variant="text" width={140} />
                              ) : (
                                <LabelStyle component={'label'} htmlFor="odd">
                                  {'Odd'}
                                </LabelStyle>
                              )}
                              {isInitialized ? (
                                <Skeleton variant="rectangular" width="100%" height={56} />
                              ) : (
                                <TextField
                                  id="odd"
                                  fullWidth
                                  {...getFieldProps('odd')}
                                  error={Boolean(touched.odd && errors.odd)}
                                  helperText={touched.odd && errors.odd}
                                  InputProps={{
                                    type: 'number'
                                  }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    convertWeightOdd({ odd: value, factor: 2 });
                                    getFieldProps('odd').onChange(e); // 👈 still update Formik state
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={120} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="description">
                                {'Description'}{' '}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={240} />
                            ) : (
                              <TextField
                                id="description"
                                fullWidth
                                {...getFieldProps('description')}
                                error={Boolean(touched.description && errors.description)}
                                helperText={touched.description && errors.description}
                                rows={9}
                                multiline
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Item Image'}
                            </LabelStyle>
                            <UploadMultiFile
                              id="product-image"
                              showPreview
                              maxSize={3145728}
                              accept="image/*"
                              files={values?.images}
                              loading={loading}
                              onDrop={handleDrop}
                              onRemove={handleRemove}
                              onRemoveAll={handleRemoveAll}
                              blob={values.blob}
                              error={Boolean(touched.images && errors.images)}
                            />
                            {touched.images && errors.images && (
                              <FormHelperText error sx={{ px: 2 }}>
                                {touched.images && errors.images}
                              </FormHelperText>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} pb={1}>
                  <div>
                    <LabelStyle component={'label'} htmlFor="value">
                      {'Value'}
                    </LabelStyle>
                    <TextField
                      id="value"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('value')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.value && errors.value)}
                      helperText={touched.value && errors.value}
                    />
                  </div>

                  <Stack spacing={2}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
                        {currentProduct ? 'Update Item' : 'Create Item'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Stack>
  );
}
AddItemForm.propTypes = {
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    boxSlug: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
    value: PropTypes.number,
    images: PropTypes.array
    // ... add other optional properties for currentProduct
  })
};
