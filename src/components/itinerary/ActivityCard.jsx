import React, { useState, useRef, useEffect } from 'react';
import { Plane, Bed, Landmark, Ticket, MapPin, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const iconMap = {
  plane: Plane,
  bed: Bed,
  temple: Landmark,
  ticket: Ticket,
  map: MapPin,
};

const ActivityCard = ({ id, time, timezone = "JST", title, description, tag, cost, iconType, onEdit, onDelete }) => {
  const { formatPrice } = useSettings();
  const IconComponent = iconMap[iconType] || Landmark;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#141622] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-teal-500/30 transition-all duration-300 group relative">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Time Column */}
        <div className="shrink-0 text-left sm:text-right min-w-[60px] pt-1">
          <div className="text-sm font-mono font-bold text-[#14b8a6] tracking-tight">
            {time}
          </div>
          <div className="text-[10px] text-gray-400 font-medium tracking-wide">
            {timezone}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-12 bg-white/10 shrink-0 self-center"></div>

        {/* Content Details */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base md:text-lg font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#14b8a6] shrink-0">
                <IconComponent size={16} />
              </span>
              <span className="truncate">{title}</span>
            </h4>

            {/* Three Dots Interactive Dropdown */}
            <div className="relative shrink-0" ref={menuRef}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${menuOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5 opacity-80 group-hover:opacity-100'}`}
                aria-label="Activity options"
                title="Options"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-30 w-36 bg-[#1a1c2a] border border-white/15 rounded-xl shadow-2xl py-1 text-xs text-gray-200 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onEdit) onEdit();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2 text-gray-200 hover:text-white transition cursor-pointer"
                  >
                    <Edit3 size={13} className="text-[#14b8a6]" />
                    <span>Edit Activity</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onDelete) onDelete();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-red-500/10 flex items-center gap-2 text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">
            {description}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-lg">
              {tag}
            </span>

            {cost > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-lg">
                {formatPrice(cost)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
