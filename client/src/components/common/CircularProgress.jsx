/**
 * CircularProgress Component
 * Circular progress indicator with percentage
 */

import React from 'react';

const CircularProgress = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = '#3B82F6',
  showPercentage = true,
  label = null
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
      )}
    </div>
  );
};

export default CircularProgress;