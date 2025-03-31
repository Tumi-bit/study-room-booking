
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
  }
  
  export interface RoomsResponse extends ApiResponse<Room[]> {}
  export interface BookingResponse extends ApiResponse<Booking> {}
  export interface UserBookingsResponse extends ApiResponse<Booking[]> {}