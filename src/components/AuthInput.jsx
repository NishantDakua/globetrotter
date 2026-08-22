import React from 'react';

const AuthInput = ({ label, type = 'text', id, placeholder, value, onChange, required = false, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 \${className}`}>
      <label htmlFor={id} className="text-xs text-gray-300 ml-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gt-input border border-gt-border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gt-primary transition-colors duration-200"
      />
    </div>
  );
};

export default AuthInput;
