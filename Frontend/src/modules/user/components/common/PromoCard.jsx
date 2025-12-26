import React, { memo } from 'react';
import { themeColors } from '../../../../theme';

const PromoCard = memo(({ title, subtitle, buttonText, image, onClick, className = '' }) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden min-w-[320px] md:min-w-[400px] h-48 md:h-56 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95"
      style={{
        boxShadow: themeColors.cardShadow,
        border: themeColors.cardBorder,
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClick}
    >
      {/* Only Image */}
      {image ? (
        <img
          src={image}
          alt={title || 'Promo'}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Image</span>
        </div>
      )}
    </div>
  );
});

PromoCard.displayName = 'PromoCard';

export default PromoCard;

