'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { BookingFormData } from '@/types';

const timeSlots: string[] = [];
for (let hour = 8; hour < 21; hour++) {
  timeSlots.push(`${hour}:00`);
  timeSlots.push(`${hour}:30`);
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  onBookRoom: (data: BookingFormData) => Promise<void>;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  roomId, 
  roomName, 
  onBookRoom 
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('8:00');
  const [endTime, setEndTime] = useState<string>('9:30');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleSubmit = async () => {
    if (!date) {
      setError('Bitte wählen Sie ein Datum');
      return;
    }
    
    setError('');
    
    // Validate that end time is after start time
    if (startTime >= endTime) {
      setError('Die Endzeit muss nach der Startzeit liegen');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(startHour, startMinute, 0);
      
      const endDateTime = new Date(date);
      endDateTime.setHours(endHour, endMinute, 0);
      
      await onBookRoom({
        roomId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      });
      
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler bei der Buchung');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredEndTimes = timeSlots.filter(time => time > startTime);
  
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    threeMonthsLater.setHours(23, 59, 59, 999);
    
    return date < today || date > threeMonthsLater;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raum buchen</DialogTitle>
          <DialogDescription>
            {roomName ? `Buchen Sie ${roomName} für Ihre Studienzeit` : 'Wählen Sie Zeit und Datum für Ihre Raumbuchung'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Datum auswählen</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDateDisabled}
              className="rounded-md border mt-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Startzeit</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Startzeit" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={`start-${time}`} value={time}>{time} Uhr</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Endzeit</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Endzeit" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEndTimes.map(time => (
                    <SelectItem key={`end-${time}`} value={time}>{time} Uhr</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gebucht...' : 'Buchen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;