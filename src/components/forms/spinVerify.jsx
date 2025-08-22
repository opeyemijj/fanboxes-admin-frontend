'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
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
  Grid,
  Skeleton,
  Divider
} from '@mui/material';
// components
import BlurImage from '../blurImage';
// yup
import * as Yup from 'yup';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';

CategoryForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  minWidth: 120, // ✅ fixed width for alignment
  flexShrink: 0
}));

export default function CategoryForm({ spinItem, isLoading: categoryLoading }) {
  const router = useRouter();
  const [verifiedResult, setVerifiedResult] = useState();

  const { mutate, isLoading } = useMutation(api.verifySpinByAdmin, {
    retry: false,
    onSuccess: (data) => {
      setVerifiedResult(data?.data);
      toast.success(data.message);
    },
    onError: (error) => {
      setVerifiedResult(null);
      toast.error(error.response.data.message);
    }
  });

  const VerifySpinSchema = Yup.object().shape({
    serverSeed: Yup.string().required('Server seed is required'),
    clientSeed: Yup.string().required('Client seed required'),
    nonce: Yup.number().required('Nonce is required')
  });

  const formik = useFormik({
    initialValues: {
      serverSeed: spinItem?.serverSeed || '',
      clientSeed: spinItem?.clientSeed || '',
      nonce: spinItem?.nonce || ''
    },
    enableReinitialize: true,
    validationSchema: VerifySpinSchema,
    onSubmit: async (values) => {
      setVerifiedResult(null);
      try {
        mutate({ ...spinItem, ...values });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  function shortenString(str) {
    if (!str) return '';
    if (str.length <= 20) return str;
    return `${str.slice(0, 20)}...${str.slice(-20)}`;
  }

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left - Seeds */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  height: '100%' // ✅ ensures equal height
                }}
              >
                <Stack spacing={3}>
                  {['serverSeed', 'clientSeed', 'nonce'].map((field, idx) => (
                    <Stack key={idx}>
                      {categoryLoading ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component="label" htmlFor={field}>
                          {field === 'serverSeed'
                            ? 'Server Seed'
                            : field === 'clientSeed'
                            ? 'Client Seed'
                            : 'Nonce'}
                        </LabelStyle>
                      )}

                      {categoryLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={48} />
                      ) : (
                        <TextField
                          size="medium"
                          disabled
                          id={field}
                          fullWidth
                          {...getFieldProps(field)}
                          error={Boolean(touched[field] && errors[field])}
                          helperText={touched[field] && errors[field]}
                        />
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Right - Box Details */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  height: '100%' // ✅ ensures equal height
                }}
              >
                <Stack spacing={2} height="100%">
                  <Stack direction="row" alignItems="center">
                    <LabelStyle>Box:</LabelStyle>
                    <Typography variant="body2" fontWeight={500}>
                      {spinItem?.boxDetails?.name}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Box>
                    <LabelStyle>Items:</LabelStyle>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: 1.5,
                        mt: 1
                      }}
                    >
                      {spinItem?.boxDetails?.items?.map((boxItems, idx) => (
                        <Card
                          key={idx}
                          variant="outlined"
                          sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderRadius: 2,
                            height: 50 // ✅ consistent height
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0
                            }}
                          >
                            <BlurImage
                              alt={boxItems?.name}
                              src={boxItems?.images[0]?.url}
                              blurDataURL={boxItems?.images[0]?.blurDataURL}
                              placeholder="blur"
                              layout="fill"
                              objectFit="cover"
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              flex: 1
                            }}
                          >
                            {boxItems.name}
                          </Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box mt={3} textAlign="right">
            {categoryLoading ? (
              <Skeleton variant="rectangular" width={180} height={50} />
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
              >
                Verify Result
              </LoadingButton>
            )}
          </Box>

          {/* Verified Result */}
          {verifiedResult && (
            <Grid mt={3} container spacing={3}>
              {/* Winning Item */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '100%' }}>
                  <Stack spacing={1.5}>
                    <Typography variant="body2">
                      <strong>Hash:</strong> {shortenString(verifiedResult?.hash)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Normalized Value:</strong> {verifiedResult?.normalized}
                    </Typography>

                    <Divider />

                    <Typography variant="subtitle2" mb={1}>
                      Winning Item
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: (theme) => `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <BlurImage
                          alt={verifiedResult?.winningItem?.name}
                          src={verifiedResult?.winningItem?.images[0]?.url}
                          blurDataURL={verifiedResult?.winningItem?.images[0]?.blurDataURL}
                          placeholder="blur"
                          layout="fill"
                          objectFit="cover"
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {verifiedResult?.winningItem?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${verifiedResult?.winningItem?.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>

              {/* Influencer */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '100%' }}>
                  <Typography variant="subtitle2" mb={1}>
                    Influencer
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: (theme) => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <BlurImage
                        alt={verifiedResult?.shopDetails?.title}
                        src={verifiedResult?.shopDetails?.logo?.url}
                        blurDataURL={verifiedResult?.shopDetails?.logo?.blurDataURL}
                        placeholder="blur"
                        layout="fill"
                        objectFit="cover"
                      />
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {verifiedResult?.shopDetails?.title}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Form>
      </FormikProvider>
    </Box>
  );
}
