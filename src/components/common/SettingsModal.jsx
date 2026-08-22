import React, { useState } from 'react';
import { X, Settings, DollarSign, Thermometer, Globe, Check } from 'lucide-react';

const DEFAULT_SETTINGS = {
  currency: 'USD',
  temperature: 'Celsius',
  language: 'English (US)'
};

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_app_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('globetrotter_app_settings', JSON.stringify(settings));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.warn('Failed to save app settings', e);
    }
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
              <h2 className="text-base font-serif font-bold text-white">Application Settings</h2>
              <p className="text-[11px] text-gray-400">Configure travel preferences and currency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Currency Selection */}
          <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <DollarSign size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Preferred Currency</div>
                <div className="text-[10px] text-gray-400">Display flight and trip budgets</div>
              </div>
            </div>

            <select
              value={settings.currency}
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

          {/* Temperature Units */}
          <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Thermometer size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Temperature Scale</div>
                <div className="text-[10px] text-gray-400">Weather forecasts in live itineraries</div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#0b0c10] p-1 rounded-lg border border-white/10">
              {['Celsius', 'Fahrenheit'].map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => handleChange('temperature', unit)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition cursor-pointer ${
                    settings.temperature === unit ? 'bg-[#009688] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {unit === 'Celsius' ? '°C' : '°F'}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
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
              value={settings.language || 'English (US)'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="bg-[#0b0c10] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 transition cursor-pointer"
            >
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
              <option value="Spanish">Español</option>
              <option value="Japanese">日本語</option>
            </select>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111219] flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-teal-400 font-medium flex items-center gap-1.5">
              <Check size={14} />
              <span>Settings saved!</span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-500">Changes apply automatically</span>
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
