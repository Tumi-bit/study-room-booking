// src/app/api/bookings/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // Changed import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { NextRequest } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      include: {
        room: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}