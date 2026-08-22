import React from 'react';
import { Edit3, Repeat, Trash2, Globe } from 'lucide-react';

const UpcomingTripCard = ({ trip, onEdit, onChange, onDelete, onTogglePublic }) => {
  const { id, title, dates, countdownDays, image } = trip;

  return (
    <div className="bg-[#141622] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
      <div>
        {/* Card Image Header with Countdown Overlay Badge */}
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141622] via-transparent to-black/30"></div>

          {/* Public Status Badge overlay (Top Left) */}
          {trip.isPublic && (
            <div className="absolute top-4 left-4 bg-teal-500/90 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg text-[10px] font-bold tracking-wide uppercase">
              <Globe size={10} />
              <span>Public</span>
            </div>
          )}

          {/* Countdown Badge overlay (Top Right) */}
          <div className="absolute top-4 right-4 bg-[#0a1215]/85 backdrop-blur-md border border-teal-500/30 px-3.5 py-1.5 rounded-xl flex flex-col items-center justify-center shadow-xl">
            <span className="text-lg font-bold text-[#14b8a6] leading-none font-mono">
              {countdownDays}
            </span>
            <span className="text-[9px] font-bold text-teal-200/70 uppercase tracking-wider">
              DAYS
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-serif font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {dates}
          </p>
        </div>
      </div>

      {/* Public Status Toggle Button */}
      {onTogglePublic && (
        <div className="px-6 pb-3 pt-0">
          <button
            onClick={() => onTogglePublic(trip)}
            className={`w-full py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-xs cursor-pointer border ${
              trip.isPublic
                ? 'bg-teal-950/40 hover:bg-teal-950/60 border-teal-500/40 text-teal-300 hover:text-teal-200'
                : 'bg-transparent hover:bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Globe size={14} className={trip.isPublic ? 'text-teal-400' : 'text-gray-400'} />
            <span>{trip.isPublic ? 'Remove from Public' : 'Make Public'}</span>
          </button>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="px-6 pb-6 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit(trip)}
          className="bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
        >
          <Edit3 size={14} className="text-gray-400" />
          <span className="truncate">Edit Trips</span>
        </button>

        <button
          onClick={() => onDelete(trip)}
          className="bg-transparent hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
        >
          <Trash2 size={14} className="text-red-400" />
          <span className="truncate">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingTripCard;
