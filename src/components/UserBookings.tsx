'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Booking } from '@/types';

const UserBookings: React.FC = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/user');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Buchung stornieren möchten?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      // Remove the cancelled booking from the list
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      setSuccessMessage('Buchung wurde erfolgreich storniert');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error cancelling booking');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center py-10">
        <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-500">Buchungen werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meine Buchungen</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Sie haben noch keine Räume gebucht.</p>
          <Link href="/">
            <Button>Zur Raumbuchung</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{booking.room?.name || 'Raum'}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(booking.startTime).toLocaleDateString('de-DE', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(booking.startTime).toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(booking.endTime).toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  {booking.room?.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{booking.room.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300 w-full"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Buchung stornieren
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;