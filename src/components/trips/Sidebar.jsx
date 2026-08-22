import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import SettingsModal from '../common/SettingsModal';
import { useSettings } from '../../context/SettingsContext';
import { 
  Home, 
  Compass, 
  Users, 
  Plus, 
  Settings, 
  Menu, 
  X,
  Luggage,
  LogOut
} from 'lucide-react';
import { auth } from '../../lib/auth';

const Sidebar = ({ onOpenNewTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: sessionData } = auth.useSession();
  const user = sessionData?.user;

  // Modal open states
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { key: 'home', name: 'Home', icon: Home, path: '/' },
    { key: 'myTrips', name: 'My Trips', icon: Luggage, path: '/trips' },
    { key: 'explore', name: 'Explore', icon: Compass, path: '/explore' },
    { key: 'community', name: 'Community', icon: Users, path: '/community' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isTripsActive = ['/trips', '/my-trips', '/itinerary', '/live-itinerary', '/new-trip'].includes(location.pathname);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111219] border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src={logoImg} 
            alt="GlobalTrotter Logo" 
            className="h-9 object-contain"
          />
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#111219] border-r border-white/5 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Logo Header (Centered & 1.5x scaled) */}
          <div 
            onClick={() => handleNav('/')}
            className="flex justify-center items-center w-full pt-1 cursor-pointer group"
          >
            <img 
              src={logoImg} 
              alt="GlobalTrotter" 
              className="h-[60px] object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="w-9 h-9 rounded-lg object-cover border border-gt-teal/50 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-[#1a2332] border border-gt-teal/40 flex items-center justify-center text-gt-teal font-semibold text-xs shrink-0 uppercase">
                    {(user.name || user.email || 'U').charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{user.name || 'Traveler'}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition shrink-0"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}

          {/* New Trip CTA */}
          <button
            onClick={() => {
              if (onOpenNewTrip) { onOpenNewTrip(); } else { navigate('/new-trip', { state: { from: location.pathname } }); }
              setMobileOpen(false);
            }}
            className="w-full bg-[#009688] hover:bg-[#008477] text-white py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-950/40 hover:shadow-teal-900/60 active:scale-[0.98] text-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>{t('newTrip') || 'New Trip'}</span>
          </button>

          {/* Main Navigation */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === 'myTrips' ? isTripsActive : location.pathname === item.path;

              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative text-left group cursor-pointer
                    ${isActive 
                      ? 'bg-[#182329]/90 text-[#14b8a6] border-r-2 border-[#009688]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-[#14b8a6]' : 'text-gray-400 group-hover:text-gray-200'} />
                  <span>{t(item.key) || item.name}</span>
                  {isActive && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#009688] shadow-[0_0_8px_#009688]"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={() => { setShowSettings(true); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition text-left cursor-pointer group"
          >
            <Settings size={16} className="text-gray-400 group-hover:text-gray-200 transition" />
            <span>{t('settings') || 'Settings'}</span>
          </button>
        </div>
      </aside>

      {/* Global Modals Triggered From Sidebar */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default Sidebar;
