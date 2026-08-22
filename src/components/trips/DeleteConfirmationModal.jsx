import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, trip, onClose, onConfirm }) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141622] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Delete Booking?</h3>
              <p className="text-xs text-gray-400">This action cannot be undone.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 space-y-1">
          <div className="font-semibold text-white">{trip.title}</div>
          <div className="text-gray-400">{trip.dates}</div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Are you sure you want to remove <strong className="text-gray-200">{trip.title}</strong> from your upcoming itineraries?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(trip.id)}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-950/50"
          >
            Delete Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
