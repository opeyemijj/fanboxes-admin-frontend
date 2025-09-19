'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, FormHelperText, Grid } from '@mui/material';
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

import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import uploadToSpaces from 'src/utils/upload';

SlideForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'deactive'];

export default function SlideForm({ data: currentSlide, isLoading: slideLoading }) {
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const { mutate, isLoading } = useMutation(
    currentSlide ? 'update' : 'new',
    currentSlide ? api.updateSlideByAdmin : api.addSlideByAdmin,
    {
      ...(currentSlide && {
        enabled: Boolean(currentSlide)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);

        router.push('/admin/slides');
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
  const NewSlideSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(50, 'Title max character limit 50'),
    highlight: Yup.string().required('Highlight is required'),
    buttonText: Yup.string().optional().max(50, 'Max button text caracter 50'),
    buttonLink: Yup.string().optional().url('Please enter a valid URL (e.g., https://example.com)'),
    description: Yup.string().optional().max(200, 'Title max character limit 200'),
    images: Yup.array().min(1, 'Image is required')
  });

  const formik = useFormik({
    initialValues: {
      title: currentSlide?.title || '',
      highlight: currentSlide?.highlight || '',
      buttonText: currentSlide?.buttonText || '',
      buttonLink: currentSlide?.buttonLink || '',
      description: currentSlide?.description || '',
      status: currentSlide?.status || STATUS_OPTIONS[0],
      images: currentSlide?.images || [], // 🔥 add this
      blob: currentSlide?.blob || [] // 🔥 add this
    },
    enableReinitialize: true,
    validationSchema: NewSlideSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          ...(currentSlide && {
            currentSlug: currentSlide.slug
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

      // console.log(newImages, 'Is it uploading');

      // Merge with existing images
      setFieldValue('images', values.images.concat(newImages[0]));
    } catch (err) {
      console.log(err, 'Field image upload');
    } finally {
      setloading(false);
    }
  };

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                {/* Title + Highlight */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="slide-title">
                      Title
                    </LabelStyle>
                    <TextField
                      id="slide-title"
                      fullWidth
                      {...getFieldProps('title')}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="slide-highlight">
                      Highlight
                    </LabelStyle>
                    <TextField
                      id="slide-highlight"
                      fullWidth
                      {...getFieldProps('highlight')}
                      error={Boolean(touched.highlight && errors.highlight)}
                      helperText={touched.highlight && errors.highlight}
                    />
                  </Grid>
                </Grid>

                {/* Button Text + Status */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="button-text">
                      Button Text
                    </LabelStyle>
                    <TextField
                      id="button-text"
                      fullWidth
                      {...getFieldProps('buttonText')}
                      error={Boolean(touched.buttonText && errors.buttonText)}
                      helperText={touched.buttonText && errors.buttonText}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabelStyle component="label" htmlFor="button-link">
                      Button Link
                    </LabelStyle>
                    <TextField
                      id="button-link"
                      fullWidth
                      {...getFieldProps('buttonLink')}
                      error={Boolean(touched.buttonLink && errors.buttonLink)}
                      helperText={touched.buttonLink && errors.buttonLink}
                    />
                  </Grid>
                </Grid>

                {/* Description */}
                <Stack sx={{ mt: 2 }}>
                  <LabelStyle component="label" htmlFor="description">
                    Description
                  </LabelStyle>
                  <TextField
                    fullWidth
                    id="description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                    rows={6}
                    multiline
                  />
                </Stack>

                <Grid item xs={12} md={12}>
                  <div>
                    <LabelStyle component={'label'} htmlFor="slide-image">
                      {'Slide Image'}
                    </LabelStyle>
                    <UploadMultiFile
                      id="slide-image"
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
              </Card>

              {/* Submit */}
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
                sx={{ ml: 'auto', mt: 3 }}
              >
                {currentSlide ? 'Update Slide' : 'Create Slide'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
