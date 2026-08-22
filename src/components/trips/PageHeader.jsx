import React from 'react';
import { Globe } from 'lucide-react';

const PageHeader = ({ countryCount = 31 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
          My Trips
        </h1>
        <p className="text-sm md:text-base text-gray-400 mt-1">
          Manage your upcoming itineraries and reflect on past adventures.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto text-xs md:text-sm font-medium text-gray-300 bg-white/[0.03] border border-white/10 px-3.5 py-2 rounded-full backdrop-blur-sm">
        <Globe size={16} className="text-gray-300" />
        <span>{countryCount} Countries Visited</span>
      </div>
    </div>
  );
};

export default PageHeader;
