import React from 'react';

const SkeletonBookingCard = () => {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="animate-pulse pl-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 mb-4" />

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-2">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonBookingCard;
