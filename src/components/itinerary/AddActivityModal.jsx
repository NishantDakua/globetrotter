import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, Edit3 } from 'lucide-react';

const AddActivityModal = ({ 
  isOpen, 
  onClose, 
  onSaveActivity, 
  initialData = null, 
  initialDayNumber = 1, 
  totalDays = 8 
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  const [dayNumber, setDayNumber] = useState(initialDayNumber);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Activity • Optional');
  const [cost, setCost] = useState('0');
  const [category, setCategory] = useState('activity');
  const [iconType, setIconType] = useState('temple');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTime(initialData.time || '10:00');
      setDescription(initialData.description || '');
      setTag(initialData.tag || 'Activity • Optional');
      setCost(initialData.cost !== undefined ? String(initialData.cost) : '0');
      setCategory(initialData.category || 'activity');
      setIconType(initialData.iconType || 'temple');
      if (initialData.dayNumber) {
        setDayNumber(initialData.dayNumber);
      }
    } else {
      setTitle('');
      setTime('10:00');
      setDescription('');
      setTag('Activity • Optional');
      setCost('0');
      setCategory('activity');
      setIconType('temple');
      setDayNumber(initialDayNumber);
    }
  }, [initialData, initialDayNumber, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericCost = parseFloat(cost) || 0;

    const activityObj = {
      id: initialData?.id || Date.now().toString(),
      time: time || '10:00',
      timezone: 'JST',
      title: title || 'Kyoto Activity',
      description: description || 'Exploring historical landmarks and autumn scenery.',
      tag: tag || 'Activity',
      cost: numericCost,
      category,
      iconType
    };

    if (onSaveActivity) {
      onSaveActivity(dayNumber, activityObj, isEditing);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141622] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#14b8a6]">
              {isEditing ? <Edit3 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                {isEditing ? 'Edit Activity' : 'Add Activity'}
              </h3>
              <p className="text-[11px] text-gray-400">Kyoto Autumn Retreat</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Day Selector */}
          <div className="space-y-1">
            <label className="font-medium text-gray-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#14b8a6]" />
              <span>Select Day</span>
            </label>
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688] cursor-pointer"
            >
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d} className="bg-[#141622] text-white">
                  Day {d} (Nov {13 + d}, 2024)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-300">Activity Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Fushimi Inari Shrine Sunset Hike"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-gray-300">Time (JST)</label>
              <input
                type="text"
                placeholder="10:00"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-gray-300">Icon Type</label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value)}
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688] cursor-pointer"
              >
                <option value="temple">Sightseeing / Temple</option>
                <option value="plane">Transport / Flight</option>
                <option value="bed">Hotel / Lodging</option>
                <option value="ticket">Event / Dining</option>
                <option value="map">Walk / Hike</option>
              </select>
            </div>
          </div>

          {/* Budget / Cost & Category Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-gray-300 flex items-center gap-1">
                <DollarSign size={14} className="text-[#14b8a6]" />
                <span>Estimated Cost ($ USD)</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 150"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-gray-300">Budget Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688] cursor-pointer"
              >
                <option value="lodging">Lodging</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="activity">Activity / Sightseeing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-300">Category Badge Label</label>
            <input
              type="text"
              placeholder="e.g. Activity • ¥500 or Lodging • Paid"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-300">Description</label>
            <textarea
              rows={3}
              placeholder="Notes, booking confirmation numbers, or itinerary tips..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#009688]"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-[#009688] hover:bg-[#008477] transition shadow-lg shadow-teal-950/50 cursor-pointer font-medium"
            >
              {isEditing ? 'Update Activity' : `Save to Day ${dayNumber}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
