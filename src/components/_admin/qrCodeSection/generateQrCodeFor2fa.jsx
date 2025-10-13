'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';

export default function TwoFAQRCodeSetup({ onSuccess }) {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  /** Mutation: Generate QR Code */
  const generateMutation = useMutation(api.generateQr, {
    onMutate: () => setQr(null),
    onSuccess: ({ data }) => {
      setQr(data.qrCodeDataURL);
      setSecret(data.secret);
    },
    onError: (error) => toast.error('Failed to generate QR code: ' + error?.data)
  });

  /** Mutation: Verify 2FA Setup */
  const verifySetupMutation = useMutation(api.verify2FASetup, {
    onSuccess: ({ message }) => {
      toast.success(message);
      onSuccess?.();
      setDigits(Array(6).fill(''));
    },
    onError: () => toast.error('Invalid 2FA code. Try again.')
  });

  /** Auto-generate QR once on mount */
  useEffect(() => {
    generateMutation.mutate();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = value ? value[0] : '';
    setDigits(newDigits);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    const finalToken = newDigits.join('');
    if (finalToken.length === 6) {
      verifySetupMutation.mutate({ token: finalToken, secret });
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newDigits[index - 1] = '';
      }
      setDigits(newDigits);
    }
  };

  const renderCodeInputs = () => (
    <Box display="flex" justifyContent="center" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }} flexWrap="nowrap" mb={3}>
      {digits.map((digit, index) => (
        <TextField
          key={index}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputRef={(el) => (inputRefs.current[index] = el)}
          type="tel"
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              fontSize: '1.4rem',
              width: 'clamp(38px, 10vw, 56px)',
              height: 'clamp(38px, 10vw, 56px)',
              borderRadius: '8px'
            }
          }}
          variant="outlined"
        />
      ))}
    </Box>
  );

  const generating = generateMutation.isLoading;
  const verifying = verifySetupMutation.isLoading;

  if (generating) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography>Generating QR Code...</Typography>
      </Box>
    );
  }

  if (!qr) {
    return (
      <Button variant="contained" color="primary" onClick={() => generateMutation.mutate()}>
        Generate QR Code
      </Button>
    );
  }

  return (
    <>
      <img src={qr} alt="QR Code" style={{ width: 180, height: 180, marginBottom: 12, borderRadius: 8 }} />
      <Typography variant="body2" mb={2} color="text.secondary">
        Scan this QR code with Google Authenticator and enter the 6-digit code below.
      </Typography>

      {renderCodeInputs()}

      <Button
        variant="contained"
        color="primary"
        onClick={() => verifySetupMutation.mutate({ token: digits.join(''), secret })}
        disabled={verifying || digits.join('').length < 6}
        sx={{
          py: 1.2,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: '10px',
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        {verifying ? <CircularProgress size={24} /> : 'Verify 2FA'}
      </Button>
    </>
  );
}
