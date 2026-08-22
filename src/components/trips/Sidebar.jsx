import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle, 
  Menu, 
  X,
  Luggage,
  MapPin
} from 'lucide-react';

const Sidebar = ({ onOpenNewTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Main Page', icon: Home, path: '/dashboard' },
    { name: 'My Trips', icon: Luggage, path: '/trips', active: true },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Community', icon: Users, path: '/community' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111219] border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-700/60 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-gray-300">
            img
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight">GlobalTrotter</div>
            <div className="text-[10px] text-gray-400 tracking-wide uppercase">Elite Explorer</div>
          </div>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#111219] border-r border-white/5 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center gap-3.5 px-2 pt-1">
            <div className="w-10 h-10 rounded-xl bg-gray-700/50 border border-white/15 flex items-center justify-center shadow-inner">
              <span className="text-xs font-mono font-semibold text-gray-300 tracking-tighter">img</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                GlobalTrotter
              </h1>
              <p className="text-[11px] font-medium text-gray-400 tracking-wide">
                Elite Explorer
              </p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active || location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.path)}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative text-left group
                    ${isActive 
                      ? 'bg-[#182329]/80 text-[#14b8a6] border-r-2 border-[#009688]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-[#14b8a6]' : 'text-gray-400 group-hover:text-gray-200'} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#009688] shadow-[0_0_8px_#009688]"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-5 pt-4">
          {/* New Trip Button */}
          <button
            onClick={() => {
              if (onOpenNewTrip) onOpenNewTrip();
              setMobileOpen(false);
            }}
            className="w-full bg-[#009688] hover:bg-[#008477] text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-950/40 hover:shadow-teal-900/60 active:scale-[0.98] text-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>New Trip</span>
          </button>

          {/* Secondary Footer Nav */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <button 
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition text-left"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <button 
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition text-left"
            >
              <HelpCircle size={18} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
