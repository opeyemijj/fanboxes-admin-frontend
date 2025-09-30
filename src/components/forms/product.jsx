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
import parseMongooseError from 'src/utils/errorHandler';
import { fanboxesAdminInfluencer } from 'src/utils/const';
import { SortArrayAlphabetically } from 'src/utils/sorting';

// ----------------------------------------------------------------------

const GENDER_OPTION = ['men', 'women', 'kids', 'others'];
const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,

  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function ProductForm({
  categories,
  currentProduct,
  categoryLoading = false,
  isInitialized = false,
  brands,
  shops,
  isVendor
}) {
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
  const { mutate, isLoading: updateLoading } = useMutation(
    currentProduct ? 'update' : 'new',
    currentProduct
      ? isVendor
        ? api.updateVendorProduct
        : api.updateProductByAdmin
      : isVendor
        ? api.createVendorProduct
        : api.createProductByAdmin,
    {
      onSuccess: (data) => {
        toast.success(data.message);

        if (currentProduct) {
          router.back();
        } else {
          // new product → redirect to list
          router.push((isVendor ? '/vendor' : '/admin') + '/products');
        }
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
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Box title is required'),
    description: Yup.string().required('Description is required'),
    description: Yup.string().required('Description is required'),
    shop: Yup.string().when('ownerType', {
      is: (val) => val === 'Influencer',
      then: (schema) => schema.required('Influencer is required'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
    slug: Yup.string().required('Slug is required'),
    category: Yup.string().required('Category is required'),
    priceSale: Yup.number().required('Sale price is required'),
    images: Yup.array().min(1, 'Images is required'),
    ownerType: Yup.string().required('Owner is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      category: categories?.some((c) => c._id === currentProduct?.category) ? currentProduct?.category : '', // empty if not found
      subCategory: currentProduct?.subCategory || (categories.length && categories[0].subCategories[0]?._id) || '',
      description: currentProduct?.description || '',
      slug: currentProduct?.slug || '',
      shop: isVendor ? null : shops?.some((s) => s._id === currentProduct?.shop) ? currentProduct.shop : '',
      priceSale: currentProduct?.priceSale || '',
      images: currentProduct?.images || [],
      blob: currentProduct?.blob || [],
      isFeatured: currentProduct?.isFeatured || false,
      ownerType: currentProduct?.ownerType || 'Admin'
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          shop: values.ownerType === 'Admin' ? '' : values.shop,
          ...(currentProduct && { currentSlug: currentProduct.slug })
        });
      } catch (err) {
        setloading(false);
        let errorMessage = parseMongooseError(err?.message);
        toast.error(errorMessage || 'We ran into an issue. Please refresh the page or try again.', {
          autoClose: false, // Prevents auto-dismissal
          closeOnClick: true // Allows clicking on the close icon
        });
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

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
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
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
                          {'Box Name'}
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
                        {isVendor ? null : (
                          <>
                            <Grid item xs={12} md={values.ownerType != 'Admin' ? 6 : 12}>
                              <FormControl fullWidth>
                                {isInitialized ? (
                                  <Skeleton variant="text" width={100} />
                                ) : (
                                  <LabelStyle component={'label'} htmlFor="shop-select">
                                    {'Owner'}
                                  </LabelStyle>
                                )}

                                <Select
                                  native
                                  {...getFieldProps('ownerType')}
                                  value={values.ownerType}
                                  id="shop-select"
                                >
                                  {['Admin', 'Influencer']?.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </Select>

                                {touched.ownerType && errors.ownerType && (
                                  <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                    {touched.ownerType && errors.ownerType}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            {values.ownerType != 'Admin' && (
                              <Grid item xs={12} md={6}>
                                <FormControl disabled={values.ownerType === 'Admin' ? true : false} fullWidth>
                                  {isInitialized ? (
                                    <Skeleton variant="text" width={100} />
                                  ) : (
                                    <LabelStyle component={'label'} htmlFor="shop-select">
                                      {'Influencer'}
                                    </LabelStyle>
                                  )}

                                  <Select native {...getFieldProps('shop')} value={values.shop} id="shop-select">
                                    {values.ownerType != 'Admin' && (
                                      <>
                                        <option value="">-- Select Influencer --</option>
                                        {shops?.map((shop) => (
                                          <option key={shop._id} value={shop._id}>
                                            {shop.title}
                                          </option>
                                        ))}
                                      </>
                                    )}
                                  </Select>

                                  {touched.shop && errors.shop && (
                                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                      {touched.shop && errors.shop}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            )}
                          </>
                        )}

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select">
                                {'Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('category')}
                                value={values.category || ''} // ensure empty string if no match
                                id="grouped-native-select"
                              >
                                {/* Empty option */}
                                <option value="">-- Select Category --</option>

                                {SortArrayAlphabetically(categories, 'name')?.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.category && errors.category && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.category && errors.category}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                                {'Sub Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('subCategory')}
                                value={values.subCategory}
                                id="grouped-native-select-subCategory"
                              >
                                {/* Empty option */}
                                <option value="">-- Select Sub Category --</option>

                                {SortArrayAlphabetically(
                                  categories.find((v) => v._id.toString() === values.category)?.subCategories,
                                  'name'
                                )?.map((subCategory) => (
                                  <option key={subCategory._id} value={subCategory._id}>
                                    {subCategory.name}
                                  </option>

                                  // </optgroup>
                                ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.subCategory && errors.subCategory && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.subCategory && errors.subCategory}
                              </FormHelperText>
                            )}
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
                              {'Box Image'}
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
                    <LabelStyle component={'label'} htmlFor="sale-price">
                      {'Spin Price'}
                    </LabelStyle>
                    <TextField
                      id="sale-price"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('priceSale')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.priceSale && errors.priceSale)}
                      helperText={touched.priceSale && errors.priceSale}
                    />
                  </div>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                            checked={values.isFeatured}
                          />
                        }
                        label={'Featured Box'}
                      />
                    </FormGroup>
                  </div>
                  <Stack spacing={2}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
                        {currentProduct ? 'Update Box' : 'Create Box'}
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
ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array.isRequired
      // ... add other required properties for category
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
    slug: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    brand: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    gender: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    subCategory: PropTypes.string,
    status: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
    ownerType: PropTypes.string,
    sku: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    available: PropTypes.number,
    images: PropTypes.array
    // ... add other optional properties for currentProduct
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      // ... add other required properties for brands
    })
  )
};
