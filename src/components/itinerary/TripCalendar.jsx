import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TripCalendar = () => {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Row 1: 10 to 16
  const row1 = [10, 11, 12, 13, 14, 15, 16];
  // Row 2: 17 to 23
  const row2 = [17, 18, 19, 20, 21, 22, 23];

  return (
    <div className="bg-[#141622] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Month & Nav Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-serif font-bold text-white tracking-tight">
          November 2024
        </h3>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days Grid Header */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 border-b border-white/5 pb-2">
        {weekDays.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      {/* Dates Rows */}
      <div className="space-y-1 text-xs">
        {/* Row 1 */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-300">
          {row1.map((d) => {
            const isStartDay = d === 14;
            const isInRange = d >= 14 && d <= 16;
            return (
              <div 
                key={d}
                className={`
                  py-1.5 rounded-lg flex items-center justify-center transition-all
                  ${isStartDay ? 'bg-[#009688] text-white font-bold shadow-[0_0_10px_rgba(0,150,136,0.6)]' : ''}
                  ${isInRange && !isStartDay ? 'bg-teal-500/15 text-[#14b8a6]' : ''}
                  ${!isInRange ? 'hover:bg-white/5' : ''}
                `}
              >
                {d}
              </div>
            );
          })}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-300">
          {row2.map((d) => {
            const isInRange = d >= 17 && d <= 21;
            return (
              <div 
                key={d}
                className={`
                  py-1.5 rounded-lg flex items-center justify-center transition-all
                  ${isInRange ? 'bg-teal-500/15 text-[#14b8a6]' : 'hover:bg-white/5'}
                `}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripCalendar;
