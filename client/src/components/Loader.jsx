import React from 'react';

/**
 * A modern, animated loader component using only Tailwind CSS
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the loader ('sm', 'md', 'lg')
 * @param {string} [props.color='blue'] - Color theme of the loader
 * @returns {JSX.Element} - Rendered loader component
 */
const Loader = ({ size = 'md', color = 'blue' }) => {
  // Size mapping
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  // Color mapping for primary and secondary colors
  const colorClasses = {
    blue: {
      primary: 'border-blue-500',
      secondary: 'border-blue-200'
    },
    indigo: {
      primary: 'border-indigo-600',
      secondary: 'border-indigo-200'
    },
    purple: {
      primary: 'border-purple-600',
      secondary: 'border-purple-200'
    },
    green: {
      primary: 'border-green-500',
      secondary: 'border-green-200'
    }
  };

  // Get the appropriate classes based on the props
  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className={`${selectedSize} rounded-full border-4 border-t-transparent border-b-transparent ${selectedColor.primary} animate-spin`}></div>
        
        {/* Middle spinning circle (opposite direction) */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'h-12 w-12' : size === 'lg' ? 'h-24 w-24' : 'h-16 w-16'} rounded-full border-4 border-r-transparent border-l-transparent ${selectedColor.secondary} animate-[spin_1s_linear_infinite_reverse]`}></div>
        
        {/* Inner pulsing circle */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'} bg-white rounded-full animate-pulse shadow-md flex items-center justify-center`}>
          {/* Dot in the center */}
          <div className={`${size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;