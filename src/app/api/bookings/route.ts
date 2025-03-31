import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { NextRequest } from 'next/server';
import type { BookingFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { roomId, startTime, endTime }: BookingFormData = await request.json();
    
    // Check if room is available for the requested time
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) },
          },
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) },
          },
        ],
      },
    });
    
    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Room already booked for this time' },
        { status: 409 }
      );
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        room: { connect: { id: roomId } },
        user: { connect: { id: session.user.id } },
      },
    });
    
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}