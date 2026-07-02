import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Order } from '@/app/api/models/Order';
import { HTTP_STATUS } from '@/constants';

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const item = await Order.findByIdAndUpdate(_id, updateData, { new: true });
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
