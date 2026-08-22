import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = () => {
  return (
    <div className="w-80 bg-gt-card backdrop-blur-md border border-gt-border rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Star className="text-blue-400 fill-blue-400" size={18} />
        <h4 className="font-semibold text-lg">"A traveler's dream."</h4>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed mb-5">
        Planning my itinerary under the stars has never felt so intuitive. GlobeTrotter anticipates my needs perfectly.
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gt-border">
          <img 
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop" 
            alt="Jordan M." 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-white leading-tight">Jordan M.</h5>
          <p className="text-xs text-gray-400">Digital Nomad</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
