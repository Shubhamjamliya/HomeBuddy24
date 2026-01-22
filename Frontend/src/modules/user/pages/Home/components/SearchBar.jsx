import React, { useState, useEffect } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import { themeColors } from '../../../../../theme';

const SearchBar = ({ onInputClick }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const serviceNames = ['facial', 'kitchen cleaning', 'AC service'];

  useEffect(() => {
    let timer;
    const currentFullText = serviceNames[currentServiceIndex];

    if (isTyping) {
      if (displayedText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 150);
      } else {
        timer = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, 100);
      } else {
        setCurrentServiceIndex((prev) => (prev + 1) % serviceNames.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isTyping, currentServiceIndex]);

  return (
    <div className="flex items-center gap-3 w-full animate-fade-in">
      <div
        className="flex-1 relative cursor-pointer group"
        onClick={onInputClick}
      >
        <div className="relative w-full">
          {/* Main Search Input Container */}
          <div
            className="w-full pl-6 pr-12 py-3.5 rounded-2xl text-[15px] bg-white border border-gray-100 transition-all duration-300 text-gray-800 flex items-center h-[52px] shadow-sm group-hover:shadow-md group-hover:border-gray-200"
          >
            <span className="text-[14px] text-gray-400 tracking-wide font-normal">
              Search for <span
                className="font-medium inline-block min-w-[2px] text-gray-700"
              >
                {displayedText}
                <span className="animate-pulse ml-0.5" style={{ color: themeColors.brand.teal }}>|</span>
              </span>
            </span>
          </div>

          {/* Magnifying Glass on the Right */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <button
        className="w-[52px] h-[52px] rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
        onClick={() => {/* Open filter */ }}
      >
        <FiSliders className="w-5 h-5 text-gray-700 group-hover:text-teal-600 transition-colors" />
      </button>
    </div>
  );
};

export default SearchBar;
