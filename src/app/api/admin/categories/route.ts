import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Category } from '@/app/api/models/Category';
import { HTTP_STATUS } from '@/constants';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const item = await Category.create(body);
    return NextResponse.json({ success: true, data: item }, { status: HTTP_STATUS.CREATED });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const item = await Category.findByIdAndUpdate(_id, updateData, { new: true });
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
