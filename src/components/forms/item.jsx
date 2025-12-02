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
  Avatar,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  Autocomplete,
  FormControlLabel,
  Switch,
  FormGroup
} from '@mui/material';
import * as api from 'src/services';
import { useMutation } from 'react-query';
import uploadToSpaces from 'src/utils/upload';
import parseMongooseError from 'src/utils/errorHandler';
import { fCurrency } from 'src/utils/formatNumber';
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { Add } from '@mui/icons-material';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function AddItemForm({ currentItem, isLoading: isApiLoading, brands, shops }) {
  console.log(currentItem, 'and', brands);
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
    brand: Yup.string().required('Brand is required'),
    margin: Yup.string().required('Item margin is required'),
    sourceType: Yup.string().required('Source type is required'),
    shop: Yup.string().when('sourceType', {
      is: (val) => val === 'Influencer',
      then: (schema) => schema.required('Influencer is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    })
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
      brandDetails: currentItem?.brandDetails || {},
      margin: currentItem?.margin || '',
      sourceType: currentItem?.sourceType || '',
      shop: shops?.some((s) => s._id === currentItem?.shop) ? currentItem.shop : '',
      isInStock: currentItem?.isInStock || false
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      try {
        mutate({
          ...values,
          shop: values.sourceType === 'Fanboxes' ? '' : values.shop,
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

                    <div>
                      <FormControl fullWidth>
                        {isApiLoading ? (
                          <Skeleton variant="text" width={100} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="shop-select">
                            {'Source Type'}
                          </LabelStyle>
                        )}

                        <Select native {...getFieldProps('sourceType')} value={values.sourceType} id="shop-select">
                          <option value="">-- Select Source Type --</option>
                          {['Fanboxes', 'Influencer']?.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </Select>

                        {touched.sourceType && errors.sourceType && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.sourceType && errors.sourceType}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    {values?.sourceType === 'Influencer' && (
                      <div>
                        <Grid item xs={12} md={12}>
                          {isApiLoading ? (
                            <Skeleton variant="text" width={120} />
                          ) : (
                            <LabelStyle htmlFor="select-shop">{'Select Influencer'}</LabelStyle>
                          )}

                          {isApiLoading ? (
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          ) : (
                            <Autocomplete
                              id="select-shop"
                              options={shops || []}
                              value={shops.find((s) => s._id?.toString() === values.shop) || null}
                              onChange={(_, selectedShop) => {
                                if (selectedShop) {
                                  setFieldValue('shop', selectedShop._id);
                                } else {
                                  setFieldValue('shop', '');
                                }
                              }}
                              getOptionLabel={(option) => option.title || ''}
                              isOptionEqualToValue={(option, value) => option._id === value._id}
                              renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    {option.logo?.url && (
                                      <Avatar
                                        src={option.logo?.url}
                                        alt={option.title}
                                        sx={{ width: 24, height: 24 }}
                                      />
                                    )}
                                    <Typography variant="body2">{option.title}</Typography>
                                  </Stack>
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Search influencer..."
                                  error={Boolean(touched.shop && errors.shop)}
                                  helperText={touched.shop && errors.shop}
                                />
                              )}
                              fullWidth
                            />
                          )}
                        </Grid>
                      </div>
                    )}

                    {/* ✅ Sweet & Searchable Brand Dropdown */}
                    {/* <div>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {isApiLoading ? (
                          <Skeleton variant="text" width={140} />
                        ) : (
                          <LabelStyle htmlFor="select-brand">{'Select Brand'}</LabelStyle>
                        )}

                        <Tooltip title="Add new Brand">
                          <IconButton color="primary" onClick={() => router.push('/admin/brands/add')}>
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {isApiLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <Autocomplete
                          key={brands}
                          id="select-brand"
                          options={brands || []}
                          value={brands.find((b) => b._id?.toString() === values.brand) || null}
                          onChange={(_, selectedBrand) => {
                            if (selectedBrand) {
                              setFieldValue('brand', selectedBrand._id);
                              setFieldValue('brandDetails', {
                                logo: selectedBrand.logo,
                                _id: selectedBrand._id,
                                name: selectedBrand.name,
                                slug: selectedBrand.slug
                              });
                            } else {
                              setFieldValue('brand', '');
                              setFieldValue('brandDetails', {});
                            }
                          }}
                          getOptionLabel={(option) => option.name || ''}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Avatar src={option.logo?.url} alt={option.name} sx={{ width: 24, height: 24 }} />
                                <Typography variant="body2">{option.name}</Typography>
                              </Stack>
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search brand..."
                              error={Boolean(touched.brand && errors.brand)}
                              helperText={touched.brand && errors.brand}
                            />
                          )}
                          fullWidth
                        />
                      )}
                    </div> */}

                    <Autocomplete
                      id="select-brand"
                      options={(brands || []).sort((a, b) => a.name.localeCompare(b.name))}
                      filterOptions={(options, state) =>
                        options.filter((option) => option.name.toLowerCase().startsWith(state.inputValue.toLowerCase()))
                      }
                      value={brands.find((b) => b._id?.toString() === values.brand) || null}
                      onChange={(_, selectedBrand) => {
                        if (selectedBrand) {
                          setFieldValue('brand', selectedBrand._id);
                          setFieldValue('brandDetails', {
                            logo: selectedBrand.logo,
                            _id: selectedBrand._id,
                            name: selectedBrand.name,
                            slug: selectedBrand.slug
                          });
                        } else {
                          setFieldValue('brand', '');
                          setFieldValue('brandDetails', {});
                        }
                      }}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar src={option.logo?.url} alt={option.name} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2">{option.name}</Typography>
                          </Stack>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search brand..."
                          error={Boolean(touched.brand && errors.brand)}
                          helperText={touched.brand && errors.brand}
                        />
                      )}
                      fullWidth
                    />

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

                  <div>
                    <LabelStyle>Margin</LabelStyle>
                    <TextField
                      fullWidth
                      {...getFieldProps('margin')}
                      error={Boolean(touched.margin && errors.margin)}
                      helperText={touched.margin && errors.margin}
                      InputProps={{ type: 'number' }}
                      onChange={(e) => {
                        getFieldProps('margin').onChange(e);
                      }}
                    />

                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('isInStock', e.target.checked)}
                            checked={values.isInStock}
                          />
                        }
                        label={'In Stock'}
                      />
                    </FormGroup>
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
