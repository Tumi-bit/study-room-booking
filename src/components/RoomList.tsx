'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Maximize, Monitor, Square } from 'lucide-react';
import type { Room } from '@/types';

interface RoomListProps {
  rooms: Room[];
  onBookRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onBookRoom }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Verfügbare Studienräume</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card key={room.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Verfügbar
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{room.location}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Maximize className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{room.size} m²</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {room.hasBeamer && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                      <Monitor className="h-3 w-3 mr-1" />
                      Beamer
                    </span>
                  )}
                  
                  {room.hasWhiteboard && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                      <Square className="h-3 w-3 mr-1" />
                      Whiteboard
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => onBookRoom(room.id)}
              >
                Raum buchen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Keine Räume gefunden, die Ihren Filterkriterien entsprechen.
        </div>
      )}
    </div>
  );
};

export default RoomList;