import { Room, RoomStatus, Booking, BookingStatus, Guest } from './types';

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', name: 'Alice Freeman', email: 'alice.f@example.com', phone: '+1 555-0101', vip: true, notes: 'Prefers high floor', lastStay: '2023-11-15' },
  { id: 'g2', name: 'Bob Smith', email: 'bob.smith@example.com', phone: '+1 555-0102', vip: false, notes: '', lastStay: '2023-10-01' },
  { id: 'g3', name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '+1 555-0103', vip: false, notes: 'Allergic to peanuts', lastStay: '2023-12-20' },
  { id: 'g4', name: 'Diana Prince', email: 'diana.p@example.com', phone: '+1 555-0104', vip: true, notes: 'Requires quiet room', lastStay: '2024-01-10' },
  { id: 'g5', name: 'Evan Wright', email: 'evan.w@example.com', phone: '+1 555-0105', vip: false, notes: 'Late check-in', lastStay: '2023-09-05' },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r101', number: '101', type: 'Deluxe King', price: 250, status: RoomStatus.OCCUPIED, floor: 1, capacity: 2, features: ['Ocean View', 'Balcony'] },
  { id: 'r102', number: '102', type: 'Standard Queen', price: 150, status: RoomStatus.AVAILABLE, floor: 1, capacity: 2, features: ['Garden View'] },
  { id: 'r103', number: '103', type: 'Suite', price: 450, status: RoomStatus.DIRTY, floor: 1, capacity: 4, features: ['Jacuzzi', 'Ocean View', 'Living Room'] },
  { id: 'r201', number: '201', type: 'Standard Twin', price: 140, status: RoomStatus.AVAILABLE, floor: 2, capacity: 2, features: [] },
  { id: 'r202', number: '202', type: 'Deluxe King', price: 260, status: RoomStatus.MAINTENANCE, floor: 2, capacity: 2, features: ['High Floor'] },
  { id: 'r203', number: '203', type: 'Suite', price: 460, status: RoomStatus.OCCUPIED, floor: 2, capacity: 4, features: ['Corner Room', 'City View'] },
  { id: 'r301', number: '301', type: 'Penthouse', price: 1200, status: RoomStatus.AVAILABLE, floor: 3, capacity: 6, features: ['Private Pool', 'Butler Service'] },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', guestId: 'g1', roomId: 'r101', checkIn: '2024-05-20', checkOut: '2024-05-25', status: BookingStatus.CHECKED_IN, totalAmount: 1250, paid: true, guestsCount: 2 },
  { id: 'b2', guestId: 'g2', roomId: 'r102', checkIn: '2024-06-01', checkOut: '2024-06-03', status: BookingStatus.CONFIRMED, totalAmount: 300, paid: false, guestsCount: 1 },
  { id: 'b3', guestId: 'g3', roomId: 'r103', checkIn: '2024-05-18', checkOut: '2024-05-22', status: BookingStatus.CHECKED_OUT, totalAmount: 1800, paid: true, guestsCount: 3 },
  { id: 'b4', guestId: 'g4', roomId: 'r203', checkIn: '2024-05-21', checkOut: '2024-05-28', status: BookingStatus.CHECKED_IN, totalAmount: 3220, paid: true, guestsCount: 2 },
];
