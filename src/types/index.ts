export interface Room {
    id: string;
    name: string;
    location: string;
    size: number;
    hasBeamer: boolean;
    hasWhiteboard: boolean;
    equipment?: string;
  }
  
  export interface Booking {
    id: string;
    startTime: Date;
    endTime: Date;
    userId: string;
    roomId: string;
    room?: Room;
  }
  
  export interface User {
    id: string;
    name?: string;
    email: string;
  }
  
  export interface RoomFilter {
    location?: string | null;
    minSize?: number | null;
    hasBeamer?: boolean;
    hasWhiteboard?: boolean;
  }
  
  export interface BookingFormData {
    roomId: string;
    startTime: string;
    endTime: string;
  }