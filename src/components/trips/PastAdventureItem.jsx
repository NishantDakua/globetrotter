import React from 'react';
import { BookOpen } from 'lucide-react';

const PastAdventureItem = ({ adventure, onReviewJournal }) => {
  const { title, dates, image } = adventure;

  return (
    <div className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-4 min-w-0">
        {/* Thumbnail Image */}
        <div className="w-16 h-14 md:w-20 md:h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Title & Dates */}
        <div className="min-w-0">
          <h4 className="text-base md:text-lg font-serif font-bold text-white tracking-tight truncate">
            {title}
          </h4>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 truncate">
            {dates}
          </p>
        </div>
      </div>

      {/* Review Journal Button */}
      <button
        onClick={() => onReviewJournal(adventure)}
        className="shrink-0 bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white px-3.5 md:px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer"
      >
        <BookOpen size={14} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
        <span className="hidden sm:inline">Review Journal</span>
        <span className="sm:hidden">Journal</span>
      </button>
    </div>
  );
};

export default PastAdventureItem;
