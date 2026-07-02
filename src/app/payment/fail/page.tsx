'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

function FailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Card>
        <CardContent sx={{ py: 6 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Payment Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Something went wrong with your payment. Please try again.
          </Typography>
          {tranId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Transaction ID: {tranId}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => router.push('/checkout')}>
              Try Again
            </Button>
            <Button variant="contained" onClick={() => router.push('/cart')}>
              Back to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function PaymentFailPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Suspense fallback={<CircularProgress />}>
        <FailContent />
      </Suspense>
    </Box>
  );
}
