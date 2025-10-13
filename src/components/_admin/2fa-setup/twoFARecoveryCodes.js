'use client';
import { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { jsPDF } from 'jspdf';
import { useMutation } from 'react-query';
import * as api from 'src/services';
import toast from 'react-hot-toast';

export default function TwoFARecoveryCodes({ onContinue }) {
  const [codes] = useState(Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 10).toUpperCase()));

  const saveRecoveryCode = useMutation(api.saveRecoveryCode, {
    onMutate: () => {},
    onSuccess: ({ data }) => {},
    onError: (error) => toast.error('Failed to save recovery code: ' + error?.data)
  });

  useEffect(() => {
    saveRecoveryCode.mutate({ codes: codes });
  }, []);

  // Generate 10 random recovery codes

  // Save recovery codes as PDF
  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Your 2FA Recovery Codes', 20, 20);
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');

    codes.forEach((code, index) => {
      doc.text(`${index + 1}. ${code}`, 20, 40 + index * 10);
    });

    doc.save('fanboxes-recovery.pdf');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        width: { xs: '91.66%', md: '58.33%' },
        textAlign: 'center',
        background: 'white',
        width: '100%'
      }}
    >
      <Typography variant="h5" mb={3} fontWeight={600}>
        Save Your Recovery Codes
      </Typography>

      <Typography mb={3} color="text.secondary">
        These recovery codes can be used if you lose access to your authenticator app. Store them securely.
      </Typography>

      {/* ✅ Responsive Recovery Code Grid */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1.5} mb={3}>
        {codes.map((code, idx) => (
          <Box
            key={idx}
            sx={{
              background: '#f7f7f7',
              borderRadius: 1,
              px: 2,
              py: 1,
              fontFamily: 'monospace',
              fontSize: '1rem',
              flex: {
                xs: '1 1 100%', // 1 column on small screens
                sm: '1 1 45%' // 2 columns on medium+
              },
              textAlign: 'center'
            }}
          >
            {code}
          </Box>
        ))}
      </Box>

      {/* ✅ Buttons */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleSaveAsPDF}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            borderRadius: '10px',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Save as PDF
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onContinue}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            borderRadius: '10px',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
}
