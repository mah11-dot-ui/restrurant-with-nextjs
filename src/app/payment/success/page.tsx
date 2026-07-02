'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get('tran_id');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (tranId) {
      fetch('/api/payments/sslcommerz/ipn', {
        method: 'POST',
        body: new URLSearchParams({ tran_id: tranId, status: 'VALID' }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setVerified(true);
        })
        .catch(() => setVerified(true));
    }
  }, [tranId]);

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Card>
        <CardContent sx={{ py: 6 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Your payment has been processed successfully.
          </Typography>
          {tranId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Transaction ID: {tranId}
            </Typography>
          )}
          {!verified && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="caption">Verifying payment...</Typography>
            </Box>
          )}
          <Button variant="contained" size="large" onClick={() => router.push('/user/orders')}>
            View Orders
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Suspense fallback={<CircularProgress />}>
        <SuccessContent />
      </Suspense>
    </Box>
  );
}
