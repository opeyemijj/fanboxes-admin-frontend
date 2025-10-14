'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { Form, FormikProvider, useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Skeleton,
  InputAdornment,
  MenuItem,
  Avatar
} from '@mui/material';
import * as api from 'src/services';
import { useMutation } from 'react-query';
import uploadToSpaces from 'src/utils/upload';
import parseMongooseError from 'src/utils/errorHandler';
import { fCurrency } from 'src/utils/formatNumber';
import UploadMultiFile from 'src/components/upload/UploadMultiFile';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function AddItemForm({ currentItem, isLoading: isApiLoading, brands }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { mutate, isLoading: updateLoading } = useMutation(
    currentItem ? 'update' : 'new',
    currentItem ? api.updateItemByAdmin : api.createAdminItem,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        router.back();
      },
      onError: (error) => {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh or try again.');
      }
    }
  );

  // ✅ Add brand & brandDetails validation
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().max(100, 'Name max limit 100 char').required('Item name is required'),
    value: Yup.string().required('Item value is required'),
    description: Yup.string().optional(),
    slug: Yup.string().required('Slug is required'),
    images: Yup.array().min(1, 'Image is required'),
    brand: Yup.string().required('Brand is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentItem?.name || '',
      description: currentItem?.description || '',
      slug: currentItem?.slug || '',
      value: currentItem?.value || '',
      images: currentItem?.images || [],
      blob: currentItem?.blob || [],
      brand: currentItem?.brand || '',
      brandDetails: currentItem?.brandDetails || {}
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          ...(currentItem && { currentSlug: currentItem.slug })
        });
      } catch (error) {
        let errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'Something went wrong.');
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => toast.error(error.response.data.message)
  });

  const handleDrop = async (acceptedFiles) => {
    setLoading(true);
    try {
      const filesWithPreview = acceptedFiles.map((file) => {
        Object.assign(file, { preview: URL.createObjectURL(file) });
        return file;
      });
      setFieldValue('blob', values.blob.concat(filesWithPreview));

      const uploads = await Promise.all(filesWithPreview.map((file) => uploadToSpaces(file)));

      const newImages = uploads.map((uploaded) => ({
        url: uploaded.url,
        _id: uploaded._id
      }));

      setFieldValue('images', values.images.concat(newImages));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAll = () => {
    values.images.forEach((image) => deleteMutate(image._id));
    setFieldValue('images', []);
  };

  const handleRemove = (file) => {
    const updatedImages = values.images.filter((_file) => {
      if (_file._id === file._id) deleteMutate(file._id);
      return _file !== file;
    });
    setFieldValue('images', updatedImages);
  };

  const handleTitleChange = (event) => {
    if (!currentItem) {
      const title = event.target.value;
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        .replace(/\s+/g, '-');
      formik.setFieldValue('slug', slug);
    }
    formik.handleChange(event);
  };

  // ✅ Handle brand selection
  const handleBrandChange = (event) => {
    const selectedId = event.target.value;
    const selectedBrand = brands.find((b) => b._id === selectedId);

    if (selectedBrand) {
      setFieldValue('brand', selectedBrand._id);
      setFieldValue('brandDetails', {
        logo: selectedBrand.logo,
        _id: selectedBrand._id,
        name: selectedBrand.name,
        slug: selectedBrand.slug
      });
    }
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
                    {/* Item Name */}
                    <div>
                      {isApiLoading ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle htmlFor="product-name">{'Item Name'}</LabelStyle>
                      )}
                      {isApiLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="product-name"
                          fullWidth
                          {...getFieldProps('name')}
                          onChange={handleTitleChange}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>

                    {/* ✅ Brand Dropdown */}
                    <div>
                      <LabelStyle htmlFor="brand">Brand</LabelStyle>
                      <TextField
                        select
                        fullWidth
                        id="brand"
                        value={values.brand}
                        onChange={handleBrandChange}
                        error={Boolean(touched.brand && errors.brand)}
                        helperText={touched.brand && errors.brand}
                      >
                        <MenuItem value="">Select Brand</MenuItem>
                        {brands?.map((brand) => (
                          <MenuItem key={brand._id} value={brand._id}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar src={brand.logo?.url} alt={brand.name} sx={{ width: 24, height: 24 }} />
                              <Typography variant="body2">{brand.name}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>

                    {/* Description */}
                    <div>
                      {isApiLoading ? (
                        <Skeleton variant="text" width={120} />
                      ) : (
                        <LabelStyle htmlFor="description">{'Description'}</LabelStyle>
                      )}
                      {isApiLoading ? (
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

                    {/* Image Upload */}
                    <div>
                      <LabelStyle htmlFor="product-image">{'Item Image'}</LabelStyle>
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
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} pb={1}>
                  {/* Value */}
                  <div>
                    <LabelStyle htmlFor="value">{'Value'}</LabelStyle>
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

                  {/* Submit */}
                  <Stack spacing={2}>
                    {isApiLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
                        {currentItem ? 'Update Item' : 'Create Item'}
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
  currentItem: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    blob: PropTypes.array,
    value: PropTypes.number,
    images: PropTypes.array,
    brand: PropTypes.string,
    brandDetails: PropTypes.object
  }),
  brands: PropTypes.array.isRequired,
  isLoading: PropTypes.bool
};
