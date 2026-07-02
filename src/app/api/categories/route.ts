import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Category } from '@/app/api/models/Category';
import { HTTP_STATUS } from '@/constants';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
