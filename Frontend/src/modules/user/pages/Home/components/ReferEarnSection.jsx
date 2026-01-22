import React from 'react';
import { themeColors } from '../../../../../theme';

const ReferEarnSection = ({ onReferClick }) => {
  return (
    <div
      className="rounded-[24px] overflow-hidden shadow-sm mx-4 mb-8 bg-white border border-gray-100 relative group transition-all duration-300 hover:shadow-md"
    >
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-100 transition-colors" />

      <div className="p-6 flex items-center justify-between relative z-10">
        <div className="flex-1">
          <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1">
            Refer & earn ₹100
          </h3>
          <p className="text-[13px] font-normal text-gray-500 max-w-[180px]">
            Invite your friends and earn rewards on every booking.
          </p>
          <button
            onClick={onReferClick}
            className="mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[13px] font-bold shadow-md hover:bg-blue-600 transition-all active:scale-95"
          >
            Refer Now
          </button>
        </div>

        {/* Gift Illustration */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner relative animate-bounce-slow">
            <span className="text-3xl">🎁</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarnSection;
