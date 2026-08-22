import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0c10] py-8 px-4 sm:px-8 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="font-serif font-bold text-base text-white tracking-tight">
          GlobalTrotter
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#support" className="hover:text-white transition-colors">Contact Support</a>
        </div>

        <div className="text-gray-500 text-[11px]">
          © 2024 GlobalTrotter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
