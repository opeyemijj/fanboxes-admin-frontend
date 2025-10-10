'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, CircularProgress, Typography, Paper, TextField } from '@mui/material';
import * as api from 'src/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch } from 'react-redux';
import { setAuthPass } from 'src/redux/slices/user';

export default function TwoFASetup() {
  const dispatch = useDispatch();
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Generate QR code
  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.generateQr();
      setQr(data.qrCodeDataURL);
      setSecret(data.secret);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate QR code. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showSetup) generate();
  }, [showSetup, generate]);

  function authPass() {
    dispatch(setAuthPass());
    router.push('/admin/dashboard');
  }

  const verify = async (finalToken) => {
    setVerifying(true);
    try {
      const { message } = await api.verify2FASetup({ token: finalToken, secret });
      toast.success(message);
      authPass();
      setDigits(Array(6).fill(''));
    } catch (error) {
      console.log(error);
      toast.error('Invalid 2FA code. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = value ? value[0] : '';
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const finalToken = newDigits.join('');
    if (finalToken.length === 6) {
      verify(finalToken);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newDigits[index - 1] = '';
        setDigits(newDigits);
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="#f5f5f5" p={2}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: {
            xs: '91.66%',
            md: '58.33%'
          },
          textAlign: 'center',
          background: 'white'
        }}
      >
        {/* Company Logo */}
        <Box display="flex" justifyContent="center" mb={2}>
          <img src="/logo.png" alt="Company Logo" style={{ width: 300, height: 'auto' }} />
        </Box>

        <Typography variant="h5" mb={3} fontWeight={600}>
          Two-Factor Authentication
        </Typography>

        {!showSetup ? (
          <>
            <Typography mb={3} color="text.secondary">
              Protect your account with 2FA. Would you like to enable it now?
            </Typography>

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowSetup(true)}
                sx={{ px: 4, py: 1.2, fontWeight: 600, borderRadius: '10px' }}
              >
                Enable 2FA
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => authPass()}
                sx={{ px: 4, py: 1.2, fontWeight: 600, borderRadius: '10px' }}
              >
                Skip for now
              </Button>
            </Box>
          </>
        ) : loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress />
            <Typography>Generating QR Code...</Typography>
          </Box>
        ) : qr ? (
          <>
            <img src={qr} alt="QR Code" style={{ width: 180, height: 180, marginBottom: 12, borderRadius: 8 }} />
            <Typography variant="body2" mb={2} color="text.secondary">
              Scan this QR code with Google Authenticator and enter the 6-digit code below.
            </Typography>

            <Box display="flex" justifyContent="center" gap={1.5} mb={3}>
              {digits.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      width: '48px',
                      height: '56px',
                      borderRadius: '8px'
                    }
                  }}
                  variant="outlined"
                />
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => verify(digits.join(''))}
              disabled={verifying || digits.join('').length < 6}
              sx={{
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '10px'
              }}
            >
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
