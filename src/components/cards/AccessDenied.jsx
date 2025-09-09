'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useRouter } from 'next-nprogress-bar';

export default function AccessDenied({ message, redirect }) {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)'
            : 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: '100%',
          textAlign: 'center',
          borderRadius: 1,
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper)
        }}
      >
        <LockOutlinedIcon color="error" sx={{ fontSize: 64, mb: 2 }} />

        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Access Denied
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          {message ||
            'Oops! You don’t have permission to view this page. Please contact your administrator if you believe this is a mistake.'}
        </Typography>

        <SentimentDissatisfiedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 3 }} />

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push(redirect || '/admin/dashboard')}
          >
            Go Back
          </Button>
          <Button variant="outlined" color="inherit" size="large" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

AccessDenied.propTypes = {
  message: PropTypes.string,
  redirect: PropTypes.string
};
