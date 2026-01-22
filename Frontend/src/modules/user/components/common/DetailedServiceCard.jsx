import React, { memo } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiEye, FiCheckCircle } from 'react-icons/fi';
import { themeColors } from '../../../../theme';
import { optimizeCloudinaryUrl } from '../../../../utils/cloudinaryOptimize';

const DetailedServiceCard = memo(({ image, title, rating, reviews, price, originalPrice, discount, onClick, onAddClick }) => {
  // Format price
  const formatPrice = (p) => {
    if (!p) return '0';
    const clean = p.toString().replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-IN').format(clean);
  };

  const displayPrice = formatPrice(price);

  return (
    <div
      className="min-w-[320px] w-full bg-white rounded-[24px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-md border border-gray-50 transition-all duration-300 p-4"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Profile/Image Section */}
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
            {image ? (
              <img
                src={optimizeCloudinaryUrl(image, { width: 144, quality: 'auto' })}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600">
                <FiEye className="w-6 h-6" />
              </div>
            )}
          </div>
          {/* Verified Badge */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <FiCheckCircle className="w-4 h-4 text-green-500 fill-current bg-white rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-teal-600 transition-colors">
              {title}
            </h3>
            {discount && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-lg">
                OFFER
              </span>
            )}
          </div>
          <p className="text-[16px] font-bold text-gray-700 mb-2">₹{displayPrice}</p>

          <div className="flex items-center gap-1">
            <AiFillStar className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-900 font-bold">{rating || '4.8'}</span>
            <span className="text-[10px] text-gray-400">({reviews || '1k+'})</span>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <FiEye className="w-4 h-4" />
          View
        </button>
        <button
          className="flex-[2] flex items-center justify-center bg-blue-500 text-white py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:bg-blue-600 transition-colors active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.();
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
});

DetailedServiceCard.displayName = 'DetailedServiceCard';

export default DetailedServiceCard;

