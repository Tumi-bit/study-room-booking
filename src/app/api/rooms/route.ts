import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in to access room information' },
      { status: 401 }
    );
  }
  
  const { searchParams } = new URL(request.url);
  
  const location = searchParams.get('location');
  const minSize = searchParams.get('minSize');
  const hasBeamer = searchParams.get('hasBeamer');
  const hasWhiteboard = searchParams.get('hasWhiteboard');
  
  const filters: any = {};
  
  if (location) filters.location = location;
  if (minSize) filters.size = { gte: parseInt(minSize) };
  if (hasBeamer === 'true') filters.hasBeamer = true;
  if (hasWhiteboard === 'true') filters.hasWhiteboard = true;
  
  try {
    const rooms = await prisma.room.findMany({ where: filters });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}