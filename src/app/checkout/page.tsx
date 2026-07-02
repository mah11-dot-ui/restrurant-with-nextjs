'use client';

import dynamic from 'next/dynamic';
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

const StripeCheckoutForm = dynamic(
  () => import('@/components/checkout/StripeCheckoutForm'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    ),
  }
);

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ maxWidth: 400, mx: 'auto' }}>
          Please sign in to proceed with checkout.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Checkout
        </Typography>
        <StripeCheckoutForm />
      </Container>
    </Box>
  );
}
