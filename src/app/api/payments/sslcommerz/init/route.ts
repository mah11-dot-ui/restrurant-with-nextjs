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
    const { userId, items, totalAmount, finalAmount, deliveryAddress, notes, customer = {} } = body;

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
      cus_name: customer?.name || 'Guest',
      cus_email: customer?.email || 'guest@example.com',
      cus_phone: customer?.phone || '01700000000',
      cus_add1: deliveryAddress || 'N/A',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'Courier',
      ship_name: customer?.name || 'Guest',
      product_name: Array.isArray(items) ? items.map((i: { name: string }) => i.name).join(', ') : 'Food Items',
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initiate SSLCommerz payment';
    return NextResponse.json(
      { success: false, error: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
