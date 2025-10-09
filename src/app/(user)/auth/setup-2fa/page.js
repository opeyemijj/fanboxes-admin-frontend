'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, TextField, Typography, Paper } from '@mui/material';
import * as api from 'src/services';
import toast from 'react-hot-toast';

export default function TwoFASetup({ userId }) {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Function to generate QR
  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.generateQr();
      setQr(data.qrCodeDataURL);
      setSecret(data.secret);
      setCountdown(30); // reset timer
    } catch (error) {
      console.error(error);
      alert('Failed to generate QR code. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically generate QR code on page load
  useEffect(() => {
    generate();
  }, []);

  // Countdown timer logic
  //   useEffect(() => {
  //     if (!qr) return;

  //     const timer = setInterval(() => {
  //       setCountdown((prev) => {
  //         if (prev <= 1) {
  //           generate(); // regenerate QR when timer ends
  //           return 60;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }, [qr, generate]);

  const verify = async () => {
    if (!token) return alert('Please enter the 2FA code.');
    setVerifying(true);
    try {
      const { data } = await api.verify2FASetup({ token, secret });
      toast.success(data.message);
      setToken('');
    } catch (error) {
      console.log(error, 'Check the 2fa verify error');
      toast.error('Invalid 2FA code. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="#f5f5f5" p={2}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Two-Factor Authentication Setup
        </Typography>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress />
            <Typography>Generating QR Code...</Typography>
          </Box>
        ) : qr ? (
          <>
            <img src={qr} alt="Scan QR code" style={{ width: 200, height: 200, marginBottom: 10 }} />
            <Typography variant="body2" mb={1}>
              Scan this QR code with Google Authenticator and enter the 6-digit code below.
            </Typography>
            {/* <Typography variant="caption" mb={2} color="textSecondary">
              Code expires in: {countdown}s
            </Typography> */}
            <TextField
              fullWidth
              label="2FA Code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Button variant="contained" color="primary" fullWidth onClick={verify} disabled={verifying}>
              {verifying ? <CircularProgress size={24} /> : 'Verify 2FA'}
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={generate}>
            Generate QR Code
          </Button>
        )}
      </Paper>
    </Box>
  );
}
