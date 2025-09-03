'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Card, Stack, TextField, Typography, Grid, FormControlLabel, Checkbox, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';

// Styles
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

RoleAddForm.propTypes = {
  routesGropuData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function RoleAddForm({ routesGropuData, onSubmit }) {
  // Formik validation
  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role name is required'),
    permissions: Yup.object().test('at-least-one', 'Select at least one permission', (value) =>
      Object.values(value).some((group) => group.some((perm) => perm.checked))
    )
  });

  // Initialize permissions state from routesGropuData
  const initialPermissions = {};
  Object.keys(routesGropuData).forEach((group) => {
    initialPermissions[group] = routesGropuData[group].map((item) => ({
      ...item,
      checked: false
    }));
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      permissions: initialPermissions
    },
    validationSchema: RoleSchema,
    onSubmit: (values) => {
      // Convert permissions object into MongoDB format
      const permittedItems = {};
      Object.keys(values.permissions).forEach((group) => {
        const selected = values.permissions[group]
          .filter((item) => item.checked)
          .map((item) => ({
            slug: item.slug,
            path: item.path,
            name: item.name
          }));

        if (selected.length > 0) {
          permittedItems[group] = selected; // only include non-empty groups
        }
      });

      console.log(permittedItems, 'Check the permitted items');

      onSubmit({
        role: values.name, // role name
        permittedItems // only groups with selected items
      });

      toast.success('Role created successfully!');
    }
  });

  const { values, setFieldValue, errors, touched, handleSubmit } = formik;

  // Toggle individual permission
  const handlePermissionChange = (group, index) => {
    const updatedGroup = [...values.permissions[group]];
    updatedGroup[index].checked = !updatedGroup[index].checked;
    setFieldValue(`permissions.${group}`, updatedGroup);
  };

  // Toggle all permissions in a group
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
            {Object.keys(routesGropuData).map((group, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ p: 3, minHeight: 420, display: 'flex', flexDirection: 'column' }}>
                  <Stack spacing={1} flexGrow={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <LabelStyle style={{ fontSize: 20 }}>{group.charAt(0).toUpperCase() + group.slice(1)}</LabelStyle>
                      <Button size="small" onClick={() => handleSelectAllGroup(group)}>
                        {values.permissions[group].every((p) => p.checked) ? 'Unselect All' : 'Select All'}
                      </Button>
                    </Box>

                    {/* Permissions Grid - 2 per row */}
                    <Grid container spacing={1}>
                      {values.permissions[group].map((perm, idx) => (
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
              <Button type="submit" variant="contained" size="large">
                Create Role
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
