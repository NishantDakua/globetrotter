import React from 'react';
import { MapPin, ArrowRight, Edit3, Repeat, Trash2 } from 'lucide-react';

const CurrentTripCard = ({ trip, onViewLiveItinerary, onEditPlanner, onChangeTrip, onDelete }) => {
  const {
    destination = "Kyoto, Japan",
    title = "Kyoto Autumn Retreat",
    dates = "Nov 12 - Nov 19, 2024",
    currentDay = 4,
    totalDays = 7,
    percentage = 57,
    image = "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop"
  } = trip || {};

  return (
    <div className="space-y-3">
      {/* Section Label */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 tracking-wider uppercase">
        <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse inline-block shadow-[0_0_8px_#14b8a6]"></span>
        <span>CURRENTLY EXPLORING</span>
      </div>

      {/* Main Hero Card */}
      <div className="bg-[#141622] border border-white/10 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Trip Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Destination Pill */}
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-200 bg-white/[0.08] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <MapPin size={14} className="text-[#14b8a6]" />
              <span>{destination}</span>
            </div>

            {/* Title & Dates */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-normal">
                {dates}
              </p>
            </div>

            {/* Progress Section */}
            <div className="pt-2 space-y-2 max-w-md">
              <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                <span>Day {currentDay} of {totalDays}</span>
                <span>{percentage}% Completed</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-[#009688] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,150,136,0.6)]" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons Stack */}
          <div className="flex flex-col gap-3 pt-2 max-w-sm">
            <button
              onClick={onViewLiveItinerary}
              className="w-full bg-[#009688] hover:bg-[#008477] text-white py-3 px-5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-950/40 hover:shadow-teal-900/60 active:scale-[0.98] text-sm cursor-pointer"
            >
              <span>View Live Itinerary</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onEditPlanner}
              className="w-full bg-transparent hover:bg-teal-500/10 border border-teal-500/40 text-teal-300 hover:text-teal-200 py-3 px-5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Edit3 size={16} />
              <span>Edit Planner</span>
            </button>

            <button
              onClick={onChangeTrip}
              className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white py-3 px-5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Repeat size={16} />
              <span>Change Trip</span>
            </button>

            {onDelete && (
              <button
                onClick={() => onDelete(trip)}
                className="w-full bg-transparent hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 py-3 px-5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete Trip</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="relative min-h-[300px] lg:min-h-full overflow-hidden group">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#141622] via-transparent to-transparent opacity-80 lg:opacity-90"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-2xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTripCard;
