'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import FilterPanel from './FilterPanel';
import RoomList from './RoomList';
import BookingModal from './BookingModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Room, RoomFilter, BookingFormData } from '@/types';

const RoomBookingPage: React.FC = () => {
  const {  status } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<RoomFilter>({
    location: null,
    minSize: null,
    hasBeamer: false,
    hasWhiteboard: false
  });
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Only fetch rooms if the user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchRooms();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, filters]);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    
    try {
      let url = '/api/rooms?';
      
      if (filters.location) {
        url += `location=${encodeURIComponent(filters.location)}&`;
      }
      
      if (filters.minSize) {
        url += `minSize=${filters.minSize}&`;
      }
      
      if (filters.hasBeamer) {
        url += 'hasBeamer=true&';
      }
      
      if (filters.hasWhiteboard) {
        url += 'hasWhiteboard=true&';
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Räume');
      }
      
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      setError(`Fehler beim Laden der Räume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: RoomFilter) => {
    setFilters(newFilters);
  };
  
  const handleBookRoom = (roomId: string) => {
    if (status !== 'authenticated') {
      setError('Bitte melden Sie sich an, um einen Raum zu buchen.');
      return;
    }
    
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setBookingRoom(room);
      setBookingModalOpen(true);
    }
  };
  
  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Buchung');
      }
      
      if (bookingRoom) {
        setSuccessMessage(`Raum ${bookingRoom.name} wurde erfolgreich gebucht!`);
      }
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Online-Buchungssystem für Studienräume</h1>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>
              Bitte melden Sie sich an, um Räume zu suchen und zu buchen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-4 text-center">
              Um das Buchungssystem nutzen zu können, müssen Sie angemeldet sein. 
              Dadurch können wir Ihre Buchungen verwalten und Ihnen eine bessere Nutzererfahrung bieten.
            </p>
            <Button onClick={() => signIn()} className="mt-2">
              Anmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-500">Wird geladen...</p>
        </div>
      </div>
    );
  }

  // Show room booking interface for authenticated users
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Online-Buchungssystem für Studienräume</h1>
      
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500">Räume werden geladen...</p>
            </div>
          ) : (
            <RoomList rooms={rooms} onBookRoom={handleBookRoom} />
          )}
        </div>
      </div>
      
      {bookingRoom && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          roomId={bookingRoom.id}
          roomName={bookingRoom.name}
          onBookRoom={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default RoomBookingPage;