import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Order } from '@/app/api/models/Order';

export async function POST(request: Request) {
  try {
    await connectDB();

    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown>;
    if (contentType.includes('json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData);
    }

    const tranId = data.tran_id as string;
    const status = data.status as string;

    if (!tranId) {
      return NextResponse.json({ success: false, error: 'Missing transaction ID' });
    }

    const updateData: Record<string, unknown> = {};

    if (status === 'VALID' || status === 'VALIDATED') {
      updateData.paymentStatus = 'paid';
      updateData.status = 'confirmed';
      updateData.transactionId = data.bank_tran_id || tranId;
    } else {
      updateData.paymentStatus = 'failed';
      updateData.status = 'cancelled';
    }

    await Order.findOneAndUpdate({ transactionId: tranId }, updateData);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'IPN processing failed' });
  }
}
