import React from 'react';

const GoogleButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center bg-gt-input border border-gt-border rounded-xl py-3 hover:bg-opacity-80 transition-all"
    >
      <span className="text-sm font-medium">Google</span>
    </button>
  );
};

export default GoogleButton;
