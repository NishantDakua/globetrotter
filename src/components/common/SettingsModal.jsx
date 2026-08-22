import React, { useState } from 'react';
import { X, Settings, DollarSign, Globe, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSettings, t } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever modal opens
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141622] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111219]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#14b8a6]">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">{t('settings')}</h2>
              <p className="text-[11px] text-gray-400">Configure currency and display language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Currency Selection */}
          <div className="flex items-center justify-between gap-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <DollarSign size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Preferred Currency</div>
                <div className="text-[10px] text-gray-400">Display flight, hotel, & trip budgets</div>
              </div>
            </div>

            <select
              value={localSettings.currency || 'USD'}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="bg-[#0b0c10] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 transition cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between gap-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Language & Region</div>
                <div className="text-[10px] text-gray-400">Application display language</div>
              </div>
            </div>

            <select
              value={localSettings.language || 'English (US)'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="bg-[#0b0c10] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 transition cursor-pointer"
            >
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="Français">Français</option>
              <option value="Deutsch">Deutsch</option>
              <option value="Español">Español</option>
              <option value="日本語">日本語</option>
            </select>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111219] flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-teal-400 font-medium flex items-center gap-1.5">
              <Check size={14} />
              <span>{t('savedSettings')}</span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-500">Changes apply instantly across app</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#009688] hover:bg-[#008477] text-white text-xs font-medium rounded-xl transition shadow-lg shadow-teal-950/40 cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
