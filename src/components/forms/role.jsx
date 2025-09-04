'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Card, Stack, TextField, Typography, Grid, FormControlLabel, Checkbox, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next-nprogress-bar';

// api
import * as api from 'src/services';
import parseMongooseError from 'src/utils/errorHandler';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

RoleAddForm.propTypes = {
  routesGropuData: PropTypes.object.isRequired
};

export default function RoleAddForm({ routesGropuData, currentRole, isLoading }) {
  const router = useRouter();

  // ✅ Mutation hook (like CategoryForm)
  const { mutate, isLoading: mutaionLoading } = useMutation(currentRole ? api.updateRoleByAdmin : api.addRoleByAdmin, {
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message || 'Role created successfully!');
      router.push('/admin/roles');
    },
    onError: (error) => {
      let errorMessage = parseMongooseError(error?.message);
      toast.error(errorMessage || 'Something went wrong. Please try again.');
    }
  });

  // ✅ Validation Schema
  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role name is required'),
    permissions: Yup.object().test('at-least-one', 'Select at least one permission', (value) =>
      Object.values(value).some((group) => group.some((perm) => perm.checked))
    )
  });

  // ✅ Initialize permissions state
  // ✅ Initialize permissions state
  const initialPermissions = {};
  Object.keys(routesGropuData || {}).forEach((group) => {
    initialPermissions[group] = (routesGropuData[group] || []).map((item) => ({
      ...item,
      checked: currentRole?.permissions?.includes(item.slug) || false // ✅ pre-check if role already has permission
    }));
  });

  const formik = useFormik({
    initialValues: {
      name: currentRole?.role || '', // ✅ use role name if editing
      permissions: initialPermissions
    },
    validationSchema: RoleSchema,
    enableReinitialize: true, // ✅ important when editing (reinitialize when currentRole changes)
    onSubmit: (values) => {
      const permittedItems = [];

      Object.keys(values.permissions).forEach((group) => {
        values.permissions[group].forEach((item) => {
          if (item.checked) {
            permittedItems.push(item.slug);
          }
        });
      });

      console.log(permittedItems, 'Permitted Item');

      mutate({
        slug: currentRole ? currentRole.slug : null,
        payload: {
          role: values.name,
          permissions: permittedItems
        }
      });
    }
  });

  const { values, setFieldValue, errors, touched, handleSubmit } = formik;

  // Toggle individual permission
  const handlePermissionChange = (group, index) => {
    const updatedGroup = values.permissions[group].map((perm, idx) =>
      idx === index ? { ...perm, checked: !perm.checked } : perm
    );
    setFieldValue(`permissions.${group}`, updatedGroup);
  };

  // Toggle all in group
  const handleSelectAllGroup = (group) => {
    const allChecked = values.permissions[group].every((perm) => perm.checked);
    const updatedGroup = values.permissions[group].map((perm) => ({
      ...perm,
      checked: !allChecked
    }));
    setFieldValue(`permissions.${group}`, updatedGroup);
  };

  return (
    <Box>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Role Name */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <LabelStyle style={{ fontSize: 20 }}>Role Name</LabelStyle>
                  <TextField
                    fullWidth
                    name="name"
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>
              </Card>
            </Grid>

            {/* Permissions */}
            {routesGropuData &&
              Object.keys(routesGropuData).map((group, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3, minHeight: 420, display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={1} flexGrow={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <LabelStyle style={{ fontSize: 20 }}>
                          {group === 'products'
                            ? 'Box'
                            : group === 'shops'
                              ? 'Influencers'
                              : group.charAt(0).toUpperCase() + group.slice(1)}
                        </LabelStyle>
                        <Button size="small" onClick={() => handleSelectAllGroup(group)}>
                          {values.permissions[group]?.every((p) => p.checked) ? 'Unselect All' : 'Select All'}
                        </Button>
                      </Box>

                      {/* Permissions Grid */}
                      <Grid container spacing={1}>
                        {values.permissions[group]?.map((perm, idx) => (
                          <Grid item xs={12} sm={6} key={idx}>
                            <FormControlLabel
                              control={
                                <Checkbox checked={perm.checked} onChange={() => handlePermissionChange(group, idx)} />
                              }
                              label={perm.name}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Card>
                </Grid>
              ))}

            {/* Submit */}
            <Grid item xs={12}>
              <LoadingButton type="submit" variant="contained" size="large" loading={mutaionLoading}>
                {!currentRole ? 'Create Role' : 'Update Role'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
