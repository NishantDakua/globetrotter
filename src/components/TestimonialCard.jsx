import React from 'react';

const TestimonialCard = () => {
  return (
    <div className="max-w-md bg-[#12151c]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Quote Icon Badge */}
      <div className="w-8 h-8 rounded-lg bg-[#0e2a25] border border-teal-500/30 flex items-center justify-center mb-4">
        <span className="text-teal-400 font-serif font-bold text-base leading-none select-none">”</span>
      </div>

      {/* Quote text */}
      <p className="text-gray-200 text-sm md:text-[15px] font-normal leading-relaxed mb-5 italic">
        "GlobalTrotter has redefined how I document my journeys. The interface feels like a meticulously crafted leather journal, perfect for curating my luxury escapades."
      </p>

      {/* Author details */}
      <div className="flex items-center gap-3.5">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
          alt="Eleanor Vance"
          className="w-10 h-10 rounded-lg object-cover border border-white/15"
        />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Eleanor Vance
          </h4>
          <p className="text-[11px] text-gray-400 font-medium">
            Travel Journalist
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
