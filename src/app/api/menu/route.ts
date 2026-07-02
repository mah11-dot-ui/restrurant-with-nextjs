import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { MenuItem } from '@/app/api/models/MenuItem';
import { HTTP_STATUS, PAGINATION } from '@/constants';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const available = searchParams.get('available');

    const query: Record<string, unknown> = {};

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (available === 'true') query.isAvailable = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      MenuItem.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      MenuItem.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
