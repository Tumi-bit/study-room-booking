import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this booking' },
        { status: 403 }
      );
    }
    
    // Check if booking is in the future
    if (new Date(booking.startTime) <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking that has already started' },
        { status: 400 }
      );
    }
    
    // Delete the booking
    await prisma.booking.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Booking successfully cancelled' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}