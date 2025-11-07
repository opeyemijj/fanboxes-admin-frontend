'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Avatar,
  CircularProgress,
  InputAdornment,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  FormHelperText,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from 'react-query';
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { Add } from '@mui/icons-material';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

export default function AddItemForm({ currentItem, isInitialized = false, isVendor, boxDetails }) {
  const router = useRouter();

  // 🔹 Fetch items
  const { data: itemsData, isLoading: itemsLoading } = useQuery(['admin-items'], () => api.getAllItems(), {
    onError: (err) => toast.error(err.message || 'Failed to load items')
  });

  const { mutate, isLoading: saving } = useMutation(
    currentItem ? 'update' : 'new',
    currentItem
      ? isVendor
        ? api.updateItemBoxByVendor
        : api.updateItemBoxByAdmin
      : isVendor
        ? api.createVendorBoxItem
        : api.createAdminBoxItem,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        router.back();
      },
      onError: (error) => {
        const errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'Something went wrong');
      }
    }
  );

  // 🔹 Form Schema
  const Schema = Yup.object().shape({
    item: Yup.object().required('Select an item'),
    weight: Yup.number().max(100, 'Max limit 100'),
    manualProb: Yup.number().max(1, 'Max limit 1')
  });

  // 🔹 Find the full item object for initial value (if editing)
  const initialItem = currentItem && itemsData?.data ? itemsData.data.find((i) => i.slug === currentItem.slug) : null;

  // 🔹 Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      item: initialItem || null,
      weight: currentItem?.weight || '',
      manualProb: currentItem?.manualProb || ''
    },
    validationSchema: Schema,
    onSubmit: async (values) => {
      try {
        mutate({
          boxSlug: boxDetails.slug,
          itemId: values.item._id,
          slug: values.item.slug,
          weight: values.weight,
          manualProb: values.manualProb,
          margin: values.margin,
          ...(currentItem && { currentSlug: currentItem.slug })
        });
      } catch (error) {
        const errorMessage = parseMongooseError(error?.message);
        toast.error(errorMessage || 'We ran into an issue.');
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  // 🔹 Convert Weight ↔ Odd
  function convertWeightOdd({ weight = null, manualProb = null }) {
    if (weight !== null && manualProb === null) {
      setFieldValue('manualProb', weight / 100);
    } else if (manualProb !== null && weight === null) {
      setFieldValue('weight', manualProb * 100);
    }
  }

  const itemOptions = SortArrayAlphabetically(itemsData?.data, 'name') || [];

  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* 🔹 Item Dropdown */}
                  <div>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <LabelStyle>Select Item</LabelStyle>

                      {/* Show plus icon only when itemsData is empty */}
                      <Tooltip title="Add new item">
                        <IconButton color="primary" onClick={() => router.push('/admin/items/add')}>
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    {isInitialized ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Autocomplete
                        fullWidth
                        options={itemOptions}
                        loading={itemsLoading}
                        value={values.item}
                        onChange={(e, val) => setFieldValue('item', val)}
                        getOptionLabel={(option) => option?.name || ''}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar src={option?.images?.[0]?.url} alt={option.name} sx={{ width: 32, height: 32 }} />
                              <Typography>{option.name}</Typography>
                            </Stack>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search items..."
                            error={Boolean(touched.item && errors.item)}
                            helperText={touched.item && errors.item}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {itemsLoading ? <CircularProgress size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                      />
                    )}
                  </div>

                  {/* 🔹 Weight Field */}
                  {/* <div>
                    <LabelStyle>Weight</LabelStyle>
                    <TextField
                      fullWidth
                      {...getFieldProps('weight')}
                      error={Boolean(touched.weight && errors.weight)}
                      helperText={touched.weight && errors.weight}
                      InputProps={{ type: 'number' }}
                      onChange={(e) => {
                        const val = e.target.value;
                        convertWeightOdd({ weight: val });
                        getFieldProps('weight').onChange(e);
                      }}
                    />
                  </div> */}

                  {/* 🔹 Odd Field */}
                  <div>
                    <LabelStyle>Manual Prob</LabelStyle>
                    <TextField
                      fullWidth
                      {...getFieldProps('manualProb')}
                      error={Boolean(touched.manualProb && errors.manualProb)}
                      helperText={touched.manualProb && errors.manualProb}
                      InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        convertWeightOdd({ manualProb: val });
                        getFieldProps('manualProb').onChange(e);
                      }}
                    />
                  </div>

                  {/* 🔹 Submit */}
                  <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={saving}>
                    {currentItem ? 'Update Item' : 'Create Item'}
                  </LoadingButton>
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
  currentItem: PropTypes.object,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  boxDetails: PropTypes.object
};
