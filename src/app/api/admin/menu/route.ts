import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { MenuItem } from '@/app/api/models/MenuItem';
import { HTTP_STATUS } from '@/constants';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const item = await MenuItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: HTTP_STATUS.CREATED });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const item = await MenuItem.findByIdAndUpdate(_id, updateData, { new: true });
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
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
    await MenuItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
