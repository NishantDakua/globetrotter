import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

const ItineraryHero = ({ title = "Kyoto Autumn Retreat", dates = "Nov 14 - Nov 21, 2024", location = "Kyoto, Japan" }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[380px] md:h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* Cinematic Background Image */}
      <img
        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop"
        alt={title}
        className="w-full h-full object-cover object-center"
      />
      
      {/* Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-black/40"></div>

      {/* Top Header - Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/trips')}
          className="inline-flex items-center gap-2 bg-[#141622]/80 hover:bg-[#141622] border border-white/15 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-medium backdrop-blur-md transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft size={16} className="text-[#14b8a6]" />
          <span>Back to My Trips</span>
        </button>
      </div>

      {/* Hero Content (Bottom Left Overlay) */}
      <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-950/80 backdrop-blur-md border border-teal-500/40 text-teal-300 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse"></span>
          <span>UPCOMING JOURNEY</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
          {title}
        </h1>

        {/* Hero Subtitle / Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium text-gray-300">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
            <Calendar size={15} className="text-[#14b8a6]" />
            <span>{dates}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
            <MapPin size={15} className="text-[#14b8a6]" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryHero;
