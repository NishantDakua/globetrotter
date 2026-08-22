import React from 'react';
import { Edit3, Repeat, Trash2 } from 'lucide-react';

const UpcomingTripCard = ({ trip, onEdit, onChange, onDelete }) => {
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

      {/* Action Buttons Row */}
      <div className="px-6 pb-6 pt-0 grid grid-cols-3 gap-2">
        <button
          onClick={() => onEdit(trip)}
          className="bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white py-2.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
        >
          <Edit3 size={14} className="text-gray-400" />
          <span className="truncate">Edit Planner</span>
        </button>

        <button
          onClick={() => onChange(trip)}
          className="bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white py-2.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
        >
          <Repeat size={14} className="text-gray-400" />
          <span className="truncate">Change Trip</span>
        </button>

        <button
          onClick={() => onDelete(trip)}
          className="bg-transparent hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 py-2.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
        >
          <Trash2 size={14} className="text-red-400" />
          <span className="truncate">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingTripCard;
