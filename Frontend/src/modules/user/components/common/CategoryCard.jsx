import React, { memo } from 'react';
import { themeColors } from '../../../../theme';

const CategoryCard = memo(({ icon, title, onClick, hasSaleBadge = false }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer relative group active:scale-95 transition-all duration-200"
      onClick={onClick}
      style={{ width: '70px' }}
    >
      <div
        className="w-[60px] h-[60px] rounded-[24px] flex items-center justify-center mb-2 relative transition-all duration-300 bg-white shadow-sm border border-gray-50 group-hover:shadow-md group-hover:-translate-y-1"
      >
        <div className="w-full h-full flex items-center justify-center p-3">
          {icon}
        </div>

        {hasSaleBadge && (
          <div
            className="absolute -top-1 -right-1 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)'
            }}
          >
            -25%
          </div>
        )}
      </div>
      <span
        className="text-[11px] text-center text-gray-500 font-medium leading-tight line-clamp-1 group-hover:text-gray-900 transition-colors"
      >
        {title}
      </span>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;

