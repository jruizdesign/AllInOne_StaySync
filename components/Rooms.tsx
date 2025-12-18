import React from 'react';
import { Room, RoomStatus } from '../types';
import { BedDouble, BadgeCheck, AlertCircle, Loader } from 'lucide-react';

interface RoomsProps {
  rooms: Room[];
}

export const Rooms: React.FC<RoomsProps> = ({ rooms }) => {
  const getStatusStyles = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'bg-white border-emerald-200 hover:border-emerald-300';
      case RoomStatus.OCCUPIED:
        return 'bg-blue-50/50 border-blue-200 hover:border-blue-300';
      case RoomStatus.DIRTY:
        return 'bg-amber-50/50 border-amber-200 hover:border-amber-300';
      case RoomStatus.MAINTENANCE:
        return 'bg-slate-100 border-slate-200 opacity-80';
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"><BadgeCheck className="w-3 h-3"/> Available</span>;
      case RoomStatus.OCCUPIED:
        return <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-md"><BedDouble className="w-3 h-3"/> Occupied</span>;
      case RoomStatus.DIRTY:
        return <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-md"><Loader className="w-3 h-3 animate-spin-slow"/> Cleaning</span>;
      case RoomStatus.MAINTENANCE:
        return <span className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-200 px-2 py-1 rounded-md"><AlertCircle className="w-3 h-3"/> Maintenance</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Room Management</h1>
        <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Occupied</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Dirty</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className={`relative p-5 rounded-xl border-2 transition-all duration-200 shadow-sm cursor-pointer group ${getStatusStyles(room.status)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-bold text-slate-800">{room.number}</h3>
              {getStatusBadge(room.status)}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">{room.type}</p>
              <p className="text-xs text-slate-500">Floor {room.floor} • Capacity {room.capacity}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-900">${room.price}<span className="text-slate-400 font-normal text-xs">/night</span></span>
              <button className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage
              </button>
            </div>
            
            {room.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {room.features.slice(0, 2).map(f => (
                        <span key={f} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                    {room.features.length > 2 && <span className="text-[10px] text-slate-400">+{room.features.length - 2}</span>}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
