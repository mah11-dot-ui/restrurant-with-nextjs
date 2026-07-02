import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Order } from '@/app/api/models/Order';
import { HTTP_STATUS } from '@/constants';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const order = await Order.create({
      user: body.userId,
      items: body.items,
      totalAmount: body.totalAmount,
      finalAmount: body.finalAmount,
      paymentMethod: body.paymentMethod,
      deliveryAddress: body.deliveryAddress,
      notes: body.notes,
    });

    return NextResponse.json(
      { success: true, data: order },
      { status: HTTP_STATUS.CREATED }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
