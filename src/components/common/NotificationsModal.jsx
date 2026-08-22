import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, Calendar, CloudSnow, Sparkles, DollarSign, CheckCircle2 } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Flight Reminder: Kyoto Autumn Retreat',
    message: 'Your upcoming journey to Kyoto departs in 14 days. Remember to pack your passport and check-in online.',
    time: '2 hours ago',
    type: 'flight',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Weather Advisory: Icelandic Ring Road',
    message: 'Light snow forecasts reported near Vik region. Drive carefully and review your winter itinerary.',
    time: '1 day ago',
    type: 'weather',
    unread: true,
  },
  {
    id: 'n3',
    title: 'New Featured Destination Added',
    message: 'The Norwegian Fjords is now trending for season expeditions. Check out curated itineraries in Explore.',
    time: '2 days ago',
    type: 'trending',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Hotel Rate Drop Saved $120',
    message: 'Price drop detected on your hotel booking in Kyoto. Discount applied automatically.',
    time: '3 days ago',
    type: 'deal',
    unread: false,
  }
];

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('globetrotter_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  }, [notifications]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'flight': return <Calendar size={16} className="text-teal-400" />;
      case 'weather': return <CloudSnow size={16} className="text-sky-400" />;
      case 'trending': return <Sparkles size={16} className="text-amber-400" />;
      case 'deal': return <DollarSign size={16} className="text-emerald-400" />;
      default: return <Bell size={16} className="text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141622] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111219]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#14b8a6]">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Travel Notifications</h2>
              <p className="text-[11px] text-gray-400">Alerts, updates, and trip reminders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        {notifications.length > 0 && (
          <div className="px-6 py-2.5 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs">
            <button
              onClick={markAllRead}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 transition"
            >
              <Check size={14} />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={clearAll}
              className="text-gray-400 hover:text-red-400 font-medium flex items-center gap-1 transition"
            >
              <Trash2 size={13} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <CheckCircle2 size={32} className="text-teal-400 mx-auto opacity-80" />
              <p className="text-sm text-gray-300 font-medium">You're all caught up!</p>
              <p className="text-xs text-gray-500">No new notifications at this time.</p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className={`p-4 flex items-start gap-3 transition-colors ${
                  item.unread ? 'bg-teal-950/20' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="p-2 rounded-xl bg-white/5 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-xs font-semibold ${item.unread ? 'text-white' : 'text-gray-300'}`}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-gray-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.message}</p>
                </div>

                <button
                  onClick={() => deleteNotification(item.id)}
                  className="text-gray-500 hover:text-gray-300 p-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition"
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111219] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
