import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { themeColors } from '../../../../../theme';

const SearchBar = ({ onInputClick }) => {
  const navigate = useNavigate();
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
      {/* Animated Pro Shop Button */}
      {/* Powerful Animated Shop Button - No Box */}
      <motion.button
        className="flex flex-col items-center justify-center gap-0.5 px-1 bg-transparent outline-none group shrink-0 relative"
        onClick={() => navigate('/user/shop')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{
            rotate: [0, -15, 15, -15, 15, 0],
            scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
            filter: [
              "drop-shadow(0px 0px 0px rgba(236, 72, 153, 0))",
              "drop-shadow(0px 0px 8px rgba(236, 72, 153, 0.6))",
              "drop-shadow(0px 0px 8px rgba(236, 72, 153, 0.6))",
              "drop-shadow(0px 0px 8px rgba(236, 72, 153, 0.6))",
              "drop-shadow(0px 0px 8px rgba(236, 72, 153, 0.6))",
              "drop-shadow(0px 0px 0px rgba(236, 72, 153, 0))"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {/* SVG Definition for Gradient Stroke */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="bag-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor="#7C3AED" offset="0%" />
                <stop stopColor="#DB2777" offset="100%" />
              </linearGradient>
            </defs>
          </svg>

          <FiShoppingBag
            className="w-8 h-8"
            style={{ stroke: "url(#bag-gradient)", strokeWidth: 2 }}
          />

          {/* Notification Dot */}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white pointer-events-none animate-bounce shadow-sm" />
        </motion.div>

        <span className="text-[10px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
          Shop
        </span>
      </motion.button>
    </div>
  );
};

export default SearchBar;
