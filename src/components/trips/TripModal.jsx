import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Check, Compass, Plus, Luggage } from 'lucide-react';
import { formatDateRange, computeCountdownDays } from '../../lib/tripsStore';

// Helper to parse date strings (e.g. "Feb 10 - Feb 24, 2025" or YYYY-MM-DD) into YYYY-MM-DD
const parseTripDates = (data) => {
  if (!data) return { start: '', end: '' };
  
  let start = data.departureDate || data.startDate || '';
  let end = data.returnDate || data.endDate || '';

  const formatISO = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  if (!start && data.dates) {
    const parts = data.dates.split(' - ');
    if (parts.length === 2) {
      const yearMatch = data.dates.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear();

      const sRaw = parts[0].includes(',') ? parts[0] : `${parts[0]}, ${year}`;
      const eRaw = parts[1].includes(',') ? parts[1] : `${parts[1]}, ${year}`;

      const sDate = new Date(sRaw);
      const eDate = new Date(eRaw);

      if (!isNaN(sDate.getTime())) start = formatISO(sDate);
      if (!isNaN(eDate.getTime())) end = formatISO(eDate);
    }
  }

  if (start && !/^\d{4}-\d{2}-\d{2}$/.test(start)) {
    const d = new Date(start);
    if (!isNaN(d.getTime())) start = formatISO(d);
  }

  if (end && !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    const d = new Date(end);
    if (!isNaN(d.getTime())) end = formatISO(d);
  }

  return { start: start || '', end: end || '' };
};

const TripModal = ({ type, data, isOpen, onClose, onSubmit }) => {
  // Form states for New Trip / Edit
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setTitle(data.title || '');
      setDestination(data.destination || '');
      const { start, end } = parseTripDates(data);
      setStartDate(start);
      setEndDate(end);
    } else if (isOpen) {
      setTitle('');
      setDestination('');
      setStartDate('');
      setEndDate('');
    }
  }, [isOpen, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onSubmit) {
        let formattedDates = data?.dates || '';
        if (startDate && endDate) {
          formattedDates = formatDateRange(startDate, endDate);
        } else if (startDate) {
          formattedDates = startDate;
        }

        const countdown = startDate ? computeCountdownDays(startDate) : (data?.countdownDays || 30);

        onSubmit({
          ...data,
          id: data?.id || `trip-${Date.now()}`,
          title: title || 'New Travel Adventure',
          destination: destination || 'Global Destination',
          startDate,
          endDate,
          departureDate: startDate,
          returnDate: endDate,
          dates: formattedDates,
          countdownDays: countdown,
          image: data?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop'
        });
      }
      setSubmitted(false);
      onClose();
    }, 400);
  };

  const titles = {
    'new-trip': 'Plan a New Trip',
    'edit-planner': `Edit Planner: ${data?.title || 'Trip'}`,
    'change-trip': `Select Active Trip`,
    'live-itinerary': `Live Itinerary: ${data?.title || 'Kyoto Autumn Retreat'}`,
    'review-journal': `Travel Journal: ${data?.title || 'Past Adventure'}`
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141622] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#14b8a6]">
              {type === 'new-trip' && <Plus size={18} />}
              {type === 'live-itinerary' && <Compass size={18} />}
              {type === 'review-journal' && <Luggage size={18} />}
              {(type === 'edit-planner' || type === 'change-trip') && <Calendar size={18} />}
            </div>
            <h3 className="text-lg font-serif font-bold text-white tracking-tight">
              {titles[type] || 'Trip Action'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body depending on action type */}
        {type === 'live-itinerary' && (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#14b8a6]">
                <MapPin size={14} />
                <span>Kyoto, Japan • Day 4 of 7</span>
              </div>
              <h4 className="text-base font-serif font-bold text-white">Today's Schedule (Nov 15)</h4>
              <ul className="space-y-2.5 pt-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] mt-1.5 shrink-0"></span>
                  <span><strong>09:00 AM:</strong> Morning bamboo grove walk at Arashiyama</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] mt-1.5 shrink-0"></span>
                  <span><strong>01:30 PM:</strong> Traditional Matcha Tea Ceremony in Gion District</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] mt-1.5 shrink-0"></span>
                  <span><strong>06:00 PM:</strong> Lantern lit walk through Pontocho Alley</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-gray-400">
              Live updates are synced across all your devices in real-time.
            </p>
          </div>
        )}

        {type === 'review-journal' && (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-base font-serif font-bold text-white">{data?.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "An unforgettable journey exploring serene landscapes, rich culinary traditions, and vibrant culture. 14 days of pure inspiration."
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/5">
                <span>📸 24 Photos Saved</span>
                <span>⭐ 5.0 Rating</span>
              </div>
            </div>
          </div>
        )}

        {(type === 'new-trip' || type === 'edit-planner') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Trip Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Swiss Alps Explorer"
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Zermatt, Switzerland"
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#009688]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#009688]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitted}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-[#009688] hover:bg-[#008477] transition shadow-lg shadow-teal-950/50 flex items-center gap-2"
              >
                {submitted ? <Check size={16} /> : null}
                <span>{submitted ? 'Saved!' : 'Save Trip'}</span>
              </button>
            </div>
          </form>
        )}

        {type === 'change-trip' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Select a trip to set as your currently active exploration:</p>
            <div className="space-y-2">
              {['Kyoto Autumn Retreat', 'Icelandic Ring Road', 'Amalfi Coast Escape'].map((item, idx) => (
                <button
                  key={idx}
                  onClick={onClose}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-left flex items-center justify-between text-xs text-white font-medium transition"
                >
                  <span>{item}</span>
                  {idx === 0 && <span className="text-[10px] text-[#14b8a6] bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">Active</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Close */}
        {(type === 'live-itinerary' || type === 'review-journal') && (
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-white/10 hover:bg-white/15 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripModal;
