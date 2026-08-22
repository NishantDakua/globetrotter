import React from 'react';
import TestimonialCard from './TestimonialCard';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-gt-bg text-white">
      {/* Left Form Side */}
      <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 py-12">
        {children}
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex flex-1 relative bg-black overflow-hidden">
        {/* Replace this with a cinematic mountain image URL */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
          alt="Cinematic Mountains"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gt-bg via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        {/* Floating Testimonial Card */}
        <div className="absolute bottom-16 right-16 z-10">
          <TestimonialCard />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
