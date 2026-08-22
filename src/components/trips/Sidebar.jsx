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
  Bell,
  User
} from 'lucide-react';

const Sidebar = ({ onOpenNewTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'My Trips', icon: Luggage, path: '/trips' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Community', icon: Users, path: '/community' },
  ];

  const handleNav = (path) => {
    if (path === '/dashboard') {
      navigate('/dashboard');
    } else if (path === '/trips') {
      navigate('/trips');
    }
    setMobileOpen(false);
  };

  const isTripsActive = ['/trips', '/my-trips', '/itinerary', '/live-itinerary', '/new-trip'].includes(location.pathname);

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
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <h1 className="text-lg font-serif font-bold text-white tracking-tight">
              GlobalTrotter
            </h1>
          </div>

          {/* User Profile Card (Reference screenshot) */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a2332] border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Alex Explorer</div>
              <div className="text-[10px] text-gray-400 truncate">Travel Enthusiast</div>
            </div>
          </div>

          {/* New Trip CTA */}
          <button
            onClick={() => {
              if (onOpenNewTrip) { onOpenNewTrip(); } else { navigate('/new-trip'); }
              setMobileOpen(false);
            }}
            className="w-full bg-[#009688] hover:bg-[#008477] text-white py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-950/40 hover:shadow-teal-900/60 active:scale-[0.98] text-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>New Trip</span>
          </button>

          {/* Main Navigation */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === 'My Trips' ? isTripsActive : location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative text-left group
                    ${isActive 
                      ? 'bg-[#182329]/90 text-[#14b8a6] border-r-2 border-[#009688]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-[#14b8a6]' : 'text-gray-400 group-hover:text-gray-200'} />
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
        <div className="space-y-1 pt-4 border-t border-white/5">
          <button 
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition text-left"
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>
          <button 
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition text-left"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
