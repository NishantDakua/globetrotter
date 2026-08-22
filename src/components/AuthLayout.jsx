import React from 'react';
import TestimonialCard from './TestimonialCard';

const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#0c0e12] text-white overflow-hidden select-none">
      {/* Left Column: Atmospheric Image + Branding + Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#090b0e] overflow-hidden flex-col justify-between p-10 xl:p-14">
        {/* High-res cinematic mountain landscape background */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
          alt="Atmospheric Mountain Landscape"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
        />

        {/* Subtle Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-[#0c0e12]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12]/90 via-black/20 to-black/50" />

        {/* Top-Left: Logo & Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="text-teal-400">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span className="font-serif text-2xl md:text-3xl text-white font-medium tracking-tight">
            GlobalTrotter
          </span>
        </div>

        {/* Bottom-Left: Testimonial Card */}
        <div className="relative z-10">
          <TestimonialCard />
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-10 xl:px-14 overflow-y-auto lg:overflow-hidden bg-[#0c0e12]">
        <div className="w-full max-w-[480px] xl:max-w-[520px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
