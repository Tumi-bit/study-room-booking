import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserBookings from '@/components/UserBookings';

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/my-bookings');
  }
  
  return <UserBookings />;
}