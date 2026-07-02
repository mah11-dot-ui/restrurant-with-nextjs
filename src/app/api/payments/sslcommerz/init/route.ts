import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Order } from '@/app/api/models/Order';
import { initPayment, generateTransactionId } from '@/services/sslcommerz';
import { config } from '@/config';
import { HTTP_STATUS } from '@/constants';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, items, totalAmount, finalAmount, deliveryAddress, notes, customer } = body;

    const tranId = generateTransactionId();

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      finalAmount,
      paymentMethod: 'sslcommerz',
      paymentStatus: 'pending',
      status: 'pending',
      transactionId: tranId,
      deliveryAddress,
      notes,
    });

    const baseUrl = config.app.url;
    const sslData = {
      total_amount: finalAmount,
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${baseUrl}/payment/success?tran_id=${tranId}`,
      fail_url: `${baseUrl}/payment/fail?tran_id=${tranId}`,
      cancel_url: `${baseUrl}/payment/cancel?tran_id=${tranId}`,
      ipn_url: `${baseUrl}/api/payments/sslcommerz/ipn`,
      cus_name: customer.name,
      cus_email: customer.email,
      cus_phone: customer.phone || '01700000000',
      cus_add1: deliveryAddress || 'N/A',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'Courier',
      product_name: items.map((i: { name: string }) => i.name).join(', '),
      product_category: 'Food',
      product_profile: 'general',
    };

    const result = await initPayment(sslData);

    if (result.status === 'success' && result.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        gatewayUrl: result.GatewayPageURL,
        transactionId: tranId,
        orderId: order._id,
      });
    }

    await Order.findByIdAndUpdate(order._id, {
      status: 'cancelled',
      paymentStatus: 'failed',
    });

    return NextResponse.json(
      { success: false, error: result.failedreason || 'SSLCommerz payment initiation failed' },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to initiate SSLCommerz payment' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
