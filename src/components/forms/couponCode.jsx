'use client';
import React from 'react';
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  FormControl,
  Grid,
  Skeleton,
  FormControlLabel,
  Radio,
  InputAdornment,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  Autocomplete,
  Chip
} from '@mui/material';
import * as api from 'src/services';
import { useRouter } from 'next-nprogress-bar';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

export default function CouponCodeForm({ data: currentCouponCode, isLoading: categoryLoading, shops = [] }) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    currentCouponCode ? 'update' : 'new',
    currentCouponCode ? api.updateCouponCodeByAdmin : api.addCouponCodeByAdmin,
    {
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/admin/coupon-codes');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const CouponCodeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    code: Yup.string()
      .required('Coupon code is required')
      .matches(/^(\S+$)/g, 'Space is not allowed'),
    discount: Yup.number().required('Discount is required'),
    expire: Yup.date().min(new Date(), "Expiry date can't be past date."),
    couponFor: Yup.string().required('Please select a coupon type'),
    selectedShops: Yup.array().when('couponFor', {
      is: 'influencer',
      then: (schema) => schema.min(1, 'Please select at least one influencer'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const formik = useFormik({
    initialValues: {
      name: currentCouponCode?.name || '',
      code: currentCouponCode?.code || '',
      type: currentCouponCode?.type || 'fixed',
      discount: currentCouponCode?.discount || '',
      expire: currentCouponCode?.expire?.split('T')[0] || '',
      description: currentCouponCode?.description || '',
      couponFor: currentCouponCode?.couponFor || 'whole-site',
      selectedShops: currentCouponCode?.selectedShops || []
    },
    enableReinitialize: true,
    validationSchema: CouponCodeSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        ...(currentCouponCode && { currentId: currentCouponCode?._id })
      };
      try {
        mutate(payload);
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
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Name */}
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component="label" htmlFor="name">
                        Name
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="name"
                        fullWidth
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </div>

                  {/* Coupon For (Whole Site or Influencer) */}
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component="label" htmlFor="name">
                        Coupon for
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <>
                        <FormControl fullWidth>
                          <Select
                            id="couponFor"
                            value={values.couponFor}
                            onChange={(e) => setFieldValue('couponFor', e.target.value)}
                            error={Boolean(touched.couponFor && errors.couponFor)}
                          >
                            <MenuItem value="whole-site">Whole Site</MenuItem>
                            <MenuItem value="influencer">Influencer</MenuItem>
                          </Select>
                        </FormControl>
                        {touched.couponFor && errors.couponFor && (
                          <Typography color="error" variant="caption">
                            {errors.couponFor}
                          </Typography>
                        )}
                      </>
                    )}
                  </div>

                  {/* Influencer Shops Multiselect */}
                  {values.couponFor === 'influencer' && (
                    <div>
                      <LabelStyle component="label" htmlFor="selectedShops">
                        Select Influencers
                      </LabelStyle>

                      <FormControl fullWidth>
                        <Autocomplete
                          multiple
                          id="selectedShops"
                          options={shops}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.title}
                          value={shops.filter((shop) => values.selectedShops.includes(shop._id))}
                          onChange={(event, selectedOptions) => {
                            const selectedIds = selectedOptions.map((option) => option._id);
                            setFieldValue('selectedShops', selectedIds);
                          }}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox checked={selected} sx={{ mr: 1 }} />
                              {option.title}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search influencer..."
                              error={Boolean(touched.selectedShops && errors.selectedShops)}
                              helperText={touched.selectedShops && errors.selectedShops}
                            />
                          )}
                          renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                key={option._id}
                                label={option.title}
                                sx={{
                                  backgroundColor: '#f3f4f6',
                                  color: '#111827',
                                  '& .MuiChip-deleteIcon': { color: '#6b7280' }
                                }}
                              />
                            ))
                          }
                          sx={{
                            '& .MuiAutocomplete-inputRoot': {
                              padding: '6px !important'
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                  )}

                  {/* Coupon Code */}
                  <div>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component="label" htmlFor="coupen-code">
                        Coupon code
                      </LabelStyle>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="coupen-code"
                        fullWidth
                        {...getFieldProps('code')}
                        error={Boolean(touched.code && errors.code)}
                        helperText={touched.code && errors.code}
                      />
                    )}
                  </div>

                  {/* Discount Type */}
                  <div>
                    <FormControl>
                      <LabelStyle component="label" htmlFor="discount-type">
                        Discount type
                      </LabelStyle>
                      <RadioGroup
                        row
                        name="row-radio-buttons-group"
                        value={values.type}
                        onChange={(e) => setFieldValue('type', e.target.value)}
                      >
                        <FormControlLabel value="fixed" control={<Radio />} label="Fixed amount" />
                        <FormControlLabel value="percent" control={<Radio />} label="Percentage" />
                      </RadioGroup>
                    </FormControl>
                  </div>

                  {/* Discount */}
                  <div>
                    <LabelStyle component="label" htmlFor="discount">
                      Discount
                    </LabelStyle>
                    <TextField
                      id="discount"
                      fullWidth
                      {...getFieldProps('discount')}
                      error={Boolean(touched.discount && errors.discount)}
                      helperText={touched.discount && errors.discount}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{values.type === 'fixed' ? '$' : '%'}</InputAdornment>
                        )
                      }}
                    />
                  </div>
                </Stack>
              </Card>
            </Grid>

            {/* Right Section */}
            <Grid item xs={12} md={4}>
              <div style={{ position: 'sticky', top: 0 }}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      {/* Description */}
                      <div>
                        <LabelStyle component="label" htmlFor="description">
                          Description
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
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <LabelStyle component="label" htmlFor="expiry-date">
                          Expiry date
                        </LabelStyle>
                        <TextField
                          id="expiry-date"
                          type="date"
                          fullWidth
                          {...getFieldProps('expire')}
                          error={Boolean(touched.expire && errors.expire)}
                          helperText={touched.expire && errors.expire}
                        />
                      </div>
                    </Stack>
                  </Card>

                  {/* Submit Button */}
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isLoading}
                    sx={{ ml: 'auto', mt: 3 }}
                  >
                    {currentCouponCode ? 'Edit Coupon Code' : 'Create Coupon Code'}
                  </LoadingButton>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}

CouponCodeForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  shops: PropTypes.array
};
