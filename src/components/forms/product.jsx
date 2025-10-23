'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { Form, FormikProvider, useFormik } from 'formik';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Skeleton,
  FormControlLabel,
  FormGroup,
  Switch,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
import parseMongooseError from 'src/utils/errorHandler';
import uploadToSpaces from 'src/utils/upload';
import { SortArrayAlphabetically } from 'src/utils/sorting';

// components
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

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

  // modal states
  const [openModal, setOpenModal] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState('');
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
        if (currentProduct) {
          setDialogMessage(data.message || 'Box updated successfully.');
          handleOpen();
        } else {
          router.push((isVendor ? '/vendor' : '/admin') + '/products');
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

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Box title is required'),
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
    ownerType: Yup.string().required('Owner is required'),
    targetRTP: Yup.string().required('Target RTP is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      category: categories?.some((c) => c._id === currentProduct?.category) ? currentProduct?.category : '',
      subCategory: currentProduct?.subCategory || (categories.length && categories[0].subCategories[0]?._id) || '',
      description: currentProduct?.description || '',
      slug: currentProduct?.slug || '',
      shop: isVendor ? null : shops?.some((s) => s._id === currentProduct?.shop) ? currentProduct.shop : '',
      priceSale: currentProduct?.priceSale || '',
      images: currentProduct?.images || [],
      blob: currentProduct?.blob || [],
      isFeatured: currentProduct?.isFeatured || false,
      targetRTP: currentProduct?.targetRTP || null,
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
          autoClose: false,
          closeOnClick: true
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
      const filesWithPreview = acceptedFiles.map((file) => {
        Object.assign(file, { preview: URL.createObjectURL(file) });
        return file;
      });

      setFieldValue('blob', values.blob.concat(filesWithPreview));

      const uploads = await Promise.all(
        filesWithPreview.map((file) =>
          uploadToSpaces(file, (progress) => {
            // Optional progress handling
          })
        )
      );

      const newImages = uploads.map((uploaded) => ({
        url: uploaded.url,
        _id: uploaded._id
      }));

      setFieldValue('images', values.images.concat(newImages));
    } catch (err) {
    } finally {
      setloading(false);
    }
  };

  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
  };

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
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(event);
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
                          onChange={handleTitleChange}
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
                                <FormControl disabled={values.ownerType === 'Admin'} fullWidth>
                                  {isInitialized ? (
                                    <Skeleton variant="text" width={100} />
                                  ) : (
                                    <LabelStyle component={'label'} htmlFor="shop-select">
                                      {'Influencer'}
                                    </LabelStyle>
                                  )}

                                  <Select native {...getFieldProps('shop')} value={values.shop} id="shop-select">
                                    <option value="">-- Select Influencer --</option>
                                    {shops?.map((shop) => (
                                      <option key={shop._id} value={shop._id}>
                                        {shop.title}
                                      </option>
                                    ))}
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
                            <LabelStyle component={'label'} htmlFor="grouped-native-select">
                              {'Category'}
                            </LabelStyle>
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('category')}
                                value={values.category || ''}
                                id="grouped-native-select"
                              >
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
                            <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                              {'Sub Category'}
                            </LabelStyle>
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('subCategory')}
                                value={values.subCategory}
                                id="grouped-native-select-subCategory"
                              >
                                <option value="">-- Select Sub Category --</option>
                                {SortArrayAlphabetically(
                                  categories.find((v) => v._id.toString() === values.category)?.subCategories,
                                  'name'
                                )?.map((subCategory) => (
                                  <option key={subCategory._id} value={subCategory._id}>
                                    {subCategory.name}
                                  </option>
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

                        <Grid item xs={12}>
                          <LabelStyle component={'label'} htmlFor="description">
                            {'Description'}
                          </LabelStyle>
                          <TextField
                            id="description"
                            fullWidth
                            {...getFieldProps('description')}
                            error={Boolean(touched.description && errors.description)}
                            helperText={touched.description && errors.description}
                            rows={9}
                            multiline
                          />
                        </Grid>

                        <Grid item xs={12}>
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
                    <LabelStyle component={'label'} htmlFor="sale-price">
                      {'Target RTP '}
                    </LabelStyle>
                    <TextField
                      id="sale-price"
                      fullWidth
                      placeholder=""
                      {...getFieldProps('targetRTP')}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">{'%'}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.targetRTP && errors.targetRTP)}
                      helperText={touched.targetRTP && errors.targetRTP}
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
                    <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
                      {currentProduct ? 'Update Box' : 'Create Box'}
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>

      {/* Success Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1rem',
            pb: 0.5
          }}
        >
          Update Successful
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText
            sx={{
              fontSize: 13,
              mb: 1,
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            {dialogMessage}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', p: 1.5, pt: 0 }}>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                handleClose();
                router.back();
              }}
            >
              Box Listing
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                handleClose();
                router.push(`${isVendor ? '/vendor' : '/admin'}/products/box/${currentProduct?.slug}`);
              }}
            >
              Items Listing
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array.isRequired
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
    ownerType: PropTypes.string,
    priceSale: PropTypes.number,
    images: PropTypes.array
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  brands: PropTypes.array
};
