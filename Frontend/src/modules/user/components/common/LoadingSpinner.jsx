import React from 'react';
import { FiLoader } from 'react-icons/fi';
import { themeColors } from '../../../../theme';

const LoadingSpinner = ({ fullScreen = true, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <FiLoader
          className="w-10 h-10 animate-spin mb-3"
          style={{ color: themeColors.button }}
        />
        {message && (
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full h-full min-h-[200px]">
      <FiLoader
        className="w-8 h-8 animate-spin mb-3"
        style={{ color: themeColors.button }}
      />
      {message && (
        <p className="text-gray-500 font-medium text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
