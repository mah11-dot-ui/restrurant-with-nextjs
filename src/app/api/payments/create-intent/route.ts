import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { config } from '@/config';
import { HTTP_STATUS } from '@/constants';

const stripe = new Stripe(config.stripe.secretKey);

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
