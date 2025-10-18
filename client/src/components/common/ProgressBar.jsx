/**
 * ProgressBar Component
 * Displays upload/loading progress with animations
 */

import React from 'react';

const ProgressBar = ({ progress, label, variant = 'primary', showPercentage = true }) => {
  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-indigo-600',
  };

  const bgColor = variants[variant] || variants.primary;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        >
          <div className="h-full w-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;