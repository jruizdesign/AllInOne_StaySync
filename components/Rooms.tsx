import React, { useState } from 'react';
import { Room, RoomStatus, User } from '../types';
import { BedDouble, BadgeCheck, AlertCircle, Loader, Plus, Trash2, X } from 'lucide-react';

interface RoomsProps {
  rooms: Room[];
  user: User | null;
  onAddRoom?: (room: Room) => void;
  onRemoveRoom?: (id: string) => void;
}

export const Rooms: React.FC<RoomsProps> = ({ rooms, user, onAddRoom, onRemoveRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
      number: '',
      type: 'Standard',
      floor: 1,
      price: 100,
      capacity: 2,
      features: []
  });

  const canEdit = user?.role === 'SUPERUSER' || user?.role === 'OWNER' || user?.role === 'MANAGER';

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

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onAddRoom && newRoom.number && newRoom.price) {
          const roomToAdd: Room = {
              id: `room_${newRoom.number}_${Date.now()}`,
              status: RoomStatus.AVAILABLE,
              features: ['Standard'], // Default
              ...newRoom as any
          };
          onAddRoom(roomToAdd);
          setIsModalOpen(false);
          setNewRoom({ number: '', type: 'Standard', floor: 1, price: 100, capacity: 2 });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Room Management</h1>
        <div className="flex items-center gap-4">
            <div className="flex gap-2 hidden sm:flex">
                <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
                <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Occupied</span>
                <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Dirty</span>
            </div>
            {canEdit && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Room
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className={`relative p-5 rounded-xl border-2 transition-all duration-200 shadow-sm cursor-pointer group ${getStatusStyles(room.status)}`}
          >
            {canEdit && onRemoveRoom && (
                <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Delete this room?')) onRemoveRoom(room.id); }}
                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Remove Room"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}

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
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                  <div className="flex justify-between items-center p-4 border-b border-slate-100">
                      <h3 className="font-bold text-slate-900">Add New Room</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
                              <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} placeholder="e.g. 101" />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Floor</label>
                              <input required type="number" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={newRoom.floor} onChange={e => setNewRoom({...newRoom, floor: parseInt(e.target.value)})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})}>
                                  <option>Standard</option>
                                  <option>Deluxe</option>
                                  <option>Suite</option>
                                  <option>Penthouse</option>
                              </select>
                          </div>
                           <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Capacity</label>
                              <input required type="number" min="1" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Price per Night ($)</label>
                          <input required type="number" min="0" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: parseInt(e.target.value)})} />
                      </div>
                      <div className="pt-2">
                          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create Room</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};