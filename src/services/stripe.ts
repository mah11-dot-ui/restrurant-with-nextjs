import { Stripe } from '@stripe/stripe-js';
import { config } from '@/config';

let stripePromise: Promise<Stripe | null> | null = null;

export async function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const { loadStripe } = await import('@stripe/stripe-js');
    stripePromise = loadStripe(config.stripe.publishableKey);
  }
  return stripePromise;
}

export async function createPaymentIntent(amount: number) {
  const res = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}
