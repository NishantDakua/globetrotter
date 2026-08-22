import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ label, id, placeholder, value, onChange, required = false, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 \${className}`}>
      <label htmlFor={id} className="text-xs text-gray-300 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-gt-input border border-gt-border rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gt-primary transition-colors duration-200"
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
