'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { config } from '@/config';
import { ROUTES } from '@/constants';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  deliveryAddress: z.string().min(5, 'Please enter a valid address'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'sslcommerz', 'cash']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey);
  }
  return stripePromise;
}

function PaymentForm({
  clientSecret,
  total,
  onBack,
}: {
  clientSecret: string;
  total: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
      return;
    }

    const { error: payError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/user/orders` },
    });

    if (payError) {
      setError(payError.message || 'Payment failed');
    }
    setIsProcessing(false);
  };

  return (
    <Box>
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
        <PaymentElement />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <LoadingButton
          variant="contained"
          size="large"
          fullWidth
          loading={isProcessing}
          disabled={!stripe}
          onClick={handlePay}
        >
          Pay {formatCurrency(total)}
        </LoadingButton>
        <Button variant="outlined" onClick={onBack} disabled={isProcessing}>
          Change Method
        </Button>
      </Box>
    </Box>
  );
}

export default function StripeCheckoutForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);

  const deliveryFee = 5.99;
  const total = subtotal + deliveryFee;

  const { control, handleSubmit, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', notes: '', paymentMethod: 'stripe' },
  });

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (paymentMethod === 'stripe' && !clientSecret && subtotal > 0) {
      setCreatingPayment(true);
      fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setClientSecret(data.clientSecret);
          else setError('Failed to initialize payment');
        })
        .catch(() => setError('Failed to initialize payment'))
        .finally(() => setCreatingPayment(false));
    }
  }, [paymentMethod, clientSecret, subtotal, total]);

  const onSubmitSslCommerz = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/sslcommerz/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || null,
          items: items.map((i) => ({
            menuItem: i.menuItem._id,
            name: i.menuItem.name,
            price: i.menuItem.price,
            quantity: i.quantity,
            notes: i.notes,
          })),
          totalAmount: subtotal,
          finalAmount: total,
          deliveryAddress: data.deliveryAddress,
          notes: data.notes,
          customer: {
            name: data.customerName || 'Guest',
            email: data.customerEmail || 'guest@example.com',
            phone: data.customerPhone || '',
          },
        }),
      });
      const result = await res.json();
      if (result.success && result.gatewayUrl) {
        window.location.href = result.gatewayUrl;
      } else {
        setError(result.error || 'Failed to initiate SSLCommerz payment');
      }
    } catch {
      setError('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmitCash = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || null,
          items: items.map((i) => ({
            menuItem: i.menuItem._id,
            name: i.menuItem.name,
            price: i.menuItem.price,
            quantity: i.quantity,
            notes: i.notes,
          })),
          totalAmount: subtotal,
          finalAmount: total,
          paymentMethod: data.paymentMethod,
          deliveryAddress: data.deliveryAddress,
          notes: data.notes,
        }),
      });
      const result = await res.json();
      if (result.success) {
        clearCart();
        router.push(ROUTES.USER_DASHBOARD);
      } else {
        setError('Failed to place order');
      }
    } catch {
      setError('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Customer Details
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Full Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="customerEmail"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Email" type="email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="customerPhone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Phone" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="deliveryAddress"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Delivery Address" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Order Notes (optional)"
                    multiline
                    rows={2}
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <FormControl>
                <FormLabel sx={{ fontWeight: 600, mb: 2 }}>Payment Method</FormLabel>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="stripe"
                        control={<Radio />}
                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CreditCardIcon /> Card</Box>}
                      />
                      <FormControlLabel
                        value="sslcommerz"
                        control={<Radio />}
                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PaymentIcon /> SSLCommerz</Box>}
                      />
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccountBalanceIcon /> Cash</Box>}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {paymentMethod === 'stripe' && (
                <Box sx={{ mt: 2 }}>
                  {creatingPayment && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                      <CircularProgress size={24} />
                      <Typography>Preparing payment...</Typography>
                    </Box>
                  )}
                  {clientSecret && !creatingPayment && (
                    <Elements stripe={getStripe()} options={{ clientSecret }}>
                      <PaymentForm clientSecret={clientSecret} total={total} onBack={() => setClientSecret(null)} />
                    </Elements>
                  )}
                  {error && !creatingPayment && !clientSecret && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Order Summary</Typography>
              {items.map((item) => (
                <Box key={item.menuItem._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2">{item.menuItem.name} x{item.quantity}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(item.menuItem.price * item.quantity)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Delivery Fee</Typography>
                <Typography variant="body2">{formatCurrency(deliveryFee)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>{formatCurrency(total)}</Typography>
              </Box>

              {(paymentMethod === 'sslcommerz' || paymentMethod === 'cash') && (
                <>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  <LoadingButton
                    variant="contained"
                    size="large"
                    fullWidth
                    loading={isProcessing}
                    onClick={handleSubmit(paymentMethod === 'sslcommerz' ? onSubmitSslCommerz : onSubmitCash)}
                    startIcon={paymentMethod === 'sslcommerz' ? <PaymentIcon /> : undefined}
                  >
                    {paymentMethod === 'sslcommerz' ? `Pay ${formatCurrency(total)} (SSLCommerz)` : 'Place Order (Cash)'}
                  </LoadingButton>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
