'use client';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
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
// yup
import * as Yup from 'yup';
// axios
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';

import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

AdminUser.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const GENDER_OPTIONS = ['male', 'female'];

export default function AdminUser({ currentUser, isLoading: userLoading }) {
  const router = useRouter();

  const [allRoleList, setAllRoleList] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  useEffect(() => {
    async function callRolesApi(params) {
      const gettingAllRoles = await api.getAllRoles();
      setAllRoleList(gettingAllRoles?.data);
    }
    callRolesApi();
  }, []);

  const { mutate, isLoading } = useMutation(
    currentUser ? 'update' : 'new',
    currentUser ? api.updateAdminUserByAdmin : api.addAdminUserByAdmin,
    {
      ...(currentUser && {
        enabled: Boolean(currentUser)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);

        router.push('/admin/admin-users');
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
    firstName: Yup.string().required('First Name is required').max(30, 'First name max char is 30'),

    lastName: Yup.string().required('Last Name is required').max(30, 'Last name max char is 30'),

    email: Yup.string().required('Email is required').email('Enter a valid email address'),
    roleId: Yup.string().required('Role is required'),

    phone: Yup.string()
      .required('Phone is required')
      .matches(/^(\+?[0-9]{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}$/, 'Enter a valid phone number'),

    password: Yup.string().when([], {
      is: () => !currentUser, // only required if creating
      then: (schema) =>
        schema
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
      otherwise: (schema) => schema.notRequired()
    }),

    confirmPassword: Yup.string().when('password', {
      is: (val) => !!val, // required if password exists
      then: (schema) =>
        schema.required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const formik = useFormik({
    initialValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      gender: currentUser?.gender || GENDER_OPTIONS[0],
      roleId: currentUser?.roleId || allRoleList[0]?._id,
      ...(currentUser
        ? {} // skip passwords in edit mode
        : { password: '', confirmPassword: '' })
    },
    enableReinitialize: true,
    validationSchema: NewCategorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentUser && {
            id: currentUser._id
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
                <Stack>
                  <Grid container spacing={2}>
                    {/* First Name */}
                    <Grid item xs={12} md={6}>
                      {userLoading ? (
                        <Skeleton variant="text" width={120} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="gender">
                          First Name
                        </LabelStyle>
                      )}
                      {userLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="firstName"
                          fullWidth
                          // placeholder="Enter first name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      )}
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} md={6}>
                      {userLoading ? (
                        <Skeleton variant="text" width={120} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="gender">
                          Last Name{' '}
                        </LabelStyle>
                      )}
                      {userLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="lastName"
                          fullWidth
                          // placeholder="Enter last name"
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {userLoading ? (
                        <Skeleton variant="text" width={120} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="gender">
                          Email{' '}
                        </LabelStyle>
                      )}
                      {userLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="email"
                          fullWidth
                          // placeholder="Enter last name"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {userLoading ? (
                        <Skeleton variant="text" width={120} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="gender">
                          Phone{' '}
                        </LabelStyle>
                      )}
                      {userLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="phone"
                          fullWidth
                          // placeholder="Enter last name"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        {userLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="gender">
                            {'Gender'}
                          </LabelStyle>
                        )}
                        {userLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <Select
                            id="gender"
                            native
                            {...getFieldProps('gender')}
                            error={Boolean(touched.gender && errors.gender)}
                          >
                            <option value="" style={{ display: 'none' }} />
                            {GENDER_OPTIONS.map((gender) => (
                              <option key={gender} value={gender}>
                                {gender}
                              </option>
                            ))}
                          </Select>
                        )}
                        {touched.gender && errors.gender && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.gender && errors.gender}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        {userLoading ? (
                          <Skeleton variant="text" width={70} />
                        ) : (
                          <LabelStyle component={'label'} htmlFor="roleId">
                            {'Role'}
                          </LabelStyle>
                        )}
                        {userLoading ? (
                          <Skeleton variant="rectangular" width="100%" height={56} />
                        ) : (
                          <Select
                            id="roleId"
                            native
                            {...getFieldProps('roleId')}
                            error={Boolean(touched.roleId && errors.roleId)}
                          >
                            <option value="" style={{ display: 'none' }} />
                            {allRoleList?.map((item, idx) => (
                              <option key={idx} value={item?._id}>
                                {item?.role}
                              </option>
                            ))}
                          </Select>
                        )}
                        {touched.role && errors.role && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.role && errors.role}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {!currentUser && !userLoading && (
                      <>
                        {/* Password */}
                        <Grid item xs={12} md={6}>
                          <LabelStyle component={'label'} htmlFor="password">
                            Password
                          </LabelStyle>
                          <TextField
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            {...getFieldProps('password')}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid item xs={12} md={6}>
                          <LabelStyle component={'label'} htmlFor="confirmPassword">
                            Confirm Password
                          </LabelStyle>
                          <TextField
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            fullWidth
                            {...getFieldProps('confirmPassword')}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Stack>
              </Card>

              {userLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ ml: 'auto', mt: 3 }}
                >
                  {currentUser ? 'Edit Admin' : 'Create Admin'}
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
