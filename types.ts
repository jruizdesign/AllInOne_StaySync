export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  DIRTY = 'Dirty',
  MAINTENANCE = 'Maintenance'
}

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked In',
  CHECKED_OUT = 'Checked Out',
  CANCELLED = 'Cancelled'
}

export type Role = 'SUPERUSER' | 'OWNER' | 'MANAGER';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: Role;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  vip: boolean;
  notes: string;
  lastStay: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: RoomStatus;
  floor: number;
  capacity: number;
  features: string[];
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  paid: boolean;
  guestsCount: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  BOOKINGS = 'BOOKINGS',
  ROOMS = 'ROOMS',
  GUESTS = 'GUESTS',
  SETTINGS = 'SETTINGS'
}
