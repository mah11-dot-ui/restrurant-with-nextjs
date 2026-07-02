import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Reservation } from '@/app/api/models/Reservation';
import { HTTP_STATUS } from '@/constants';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const reservation = await Reservation.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: new Date(body.date),
      time: body.time,
      guests: body.guests,
      specialRequests: body.specialRequests,
      user: body.userId,
    });

    return NextResponse.json(
      { success: true, data: reservation },
      { status: HTTP_STATUS.CREATED }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create reservation' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;

    const reservations = await Reservation.find(query)
      .sort({ date: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: reservations });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reservations' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
