import React, { memo } from 'react';
import { themeColors } from '../../../../theme';
import { FiCalendar } from 'react-icons/fi';

const PromoCard = memo(({ title, subtitle, buttonText, image, onClick }) => {
  return (
    <div
      className="relative rounded-[28px] overflow-hidden w-[calc(100vw-32px)] max-w-lg aspect-[2/1] min-h-[160px] cursor-pointer transition-all duration-300 hover:shadow-xl group"
      onClick={onClick}
    >
      {/* Background Image / Gradient */}
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #2874F0 0%, #1a56b9 100%)' }}
        />
      )}

      <div className="relative z-10 p-6 flex flex-col h-full justify-end items-start w-full">
        {/* Button - Only element kept per user request */}
        <button
          className="px-6 py-2.5 bg-[#FACC15] text-gray-900 rounded-xl text-[14px] font-black shadow-lg shadow-black/20 hover:bg-yellow-300 transition-all active:scale-95 uppercase tracking-tight"
          style={{ backgroundColor: '#FACC15' }}
        >
          Explore
        </button>
      </div>
    </div>
  );
});

PromoCard.displayName = 'PromoCard';

export default PromoCard;
