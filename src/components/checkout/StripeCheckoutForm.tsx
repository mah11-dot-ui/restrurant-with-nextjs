'use client';

import { useState } from 'react';
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
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { config } from '@/config';
import { ROUTES } from '@/constants';

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, 'Please enter a valid address'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'cash']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise() {
  if (typeof window === 'undefined') return null;
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey);
  }
  return stripePromise;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = 5.99;
  const total = subtotal + deliveryFee;

  const { control, handleSubmit, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryAddress: '', notes: '', paymentMethod: 'stripe' },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.paymentMethod === 'stripe') {
      if (!stripe || !elements) return;
      setIsProcessing(true);

      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const paymentData = await res.json();

      if (!paymentData.success) {
        setError('Failed to initialize payment');
        setIsProcessing(false);
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      const { error: payError } = await stripe.confirmPayment({
        elements,
        clientSecret: paymentData.clientSecret,
        confirmParams: { return_url: `${window.location.origin}/user/orders` },
      });

      if (payError) setError(payError.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      setIsProcessing(true);
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Delivery Details
              </Typography>

              <Controller
                name="deliveryAddress"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Delivery Address"
                    multiline
                    rows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />

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
                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CreditCardIcon /> Card Payment</Box>}
                      />
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccountBalanceIcon /> Cash on Delivery</Box>}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {paymentMethod === 'stripe' && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <PaymentElement />
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

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={isProcessing}
                disabled={!stripe && paymentMethod === 'stripe'}
              >
                {paymentMethod === 'stripe' ? `Pay ${formatCurrency(total)}` : 'Place Order'}
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function StripeCheckoutForm() {
  const stripePromise = getStripePromise();

  if (!stripePromise) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading payment options...</Typography>
      </Box>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
