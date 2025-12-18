import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Booking, BookingStatus, Guest, Room } from '../types';

interface BookingsProps {
  bookings: Booking[];
  guests: Guest[];
  rooms: Room[];
}

export const Bookings: React.FC<BookingsProps> = ({ bookings, guests, rooms }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case BookingStatus.CHECKED_IN: return 'bg-emerald-100 text-emerald-700';
      case BookingStatus.CHECKED_OUT: return 'bg-slate-100 text-slate-700';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredBookings = bookings.filter(b => {
      const guest = guests.find(g => g.id === b.guestId);
      return guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             b.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
          New Booking
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by guest name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => {
                const guest = guests.find(g => g.id === booking.guestId);
                const room = rooms.find(r => r.id === booking.roomId);

                return (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {guest?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{guest?.name}</div>
                          <div className="text-xs text-slate-500">{guest?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      Room {room?.number} <span className="text-slate-400 text-xs">({room?.type})</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">to {new Date(booking.checkOut).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status).replace('text', 'border-transparent')}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${booking.totalAmount}
                      {!booking.paid && <span className="ml-2 text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Unpaid</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <button className="hover:text-slate-900 p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
             <div className="p-8 text-center text-slate-500">
               No bookings found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
