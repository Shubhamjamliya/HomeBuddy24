import React from 'react';
import CategoryCard from '../../../components/common/CategoryCard';
import { FiGrid } from 'react-icons/fi';

const toAssetUrl = (url) => {
  if (!url) return '';
  const clean = url.replace('/api/upload', '/upload');
  if (clean.startsWith('http')) return clean;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');
  return `${base}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

const ServiceCategories = React.memo(({ categories, onCategoryClick, onSeeAllClick }) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  // Display only first 7 categories + 'More' item to match the 4x2 grid look
  const displayCategories = categories.slice(0, 7);
  const moreItem = {
    id: 'more',
    title: 'More',
    icon: 'more-icon-placeholder', // We'll handle this in CategoryCard or here
    isMore: true
  };

  return (
    <div className="px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Service Categories
        </h2>
        <button
          onClick={onSeeAllClick}
          className="text-[13px] font-medium text-gray-400 hover:text-teal-600 transition-colors"
        >
          View all
        </button>
      </div>

      {/* 4x2 Grid Container */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-2">
        {displayCategories.map((category, index) => (
          <div key={category.id} className="flex justify-center">
            <CategoryCard
              title={category.title}
              icon={
                <img
                  src={toAssetUrl(category.icon || category.image)}
                  alt={category.title}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              }
              onClick={() => onCategoryClick?.(category)}
              hasSaleBadge={category.hasSaleBadge}
              index={index}
            />
          </div>
        ))}

        {/* 'More' Button to complete the grid if we have many categories */}
        <div className="flex justify-center">
          <CategoryCard
            title="More"
            icon={
              <div className="w-10 h-10 flex items-center justify-center">
                <FiGrid className="w-6 h-6 text-blue-500" />
              </div>
            }
            onClick={onSeeAllClick}
            index={7}
          />
        </div>
      </div>
    </div>
  );
});

ServiceCategories.displayName = 'ServiceCategories';

export default ServiceCategories;

