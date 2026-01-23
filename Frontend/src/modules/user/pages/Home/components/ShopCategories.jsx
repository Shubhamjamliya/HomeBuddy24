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

const ShopCategories = React.memo(({ categories, onCategoryClick }) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  return (
    <div className="pl-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pr-4">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Shop Categories
        </h2>
        {/* Optional View All button if needed later */}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 pr-4 scrollbar-hide -ml-1 pl-1">
        {categories.map((category, index) => (
          <div key={category.id || category._id} className="flex-shrink-0">
            <CategoryCard
              title={category.name || category.title}
              icon={
                <img
                  src={toAssetUrl(category.image || category.icon)}
                  alt={category.name || category.title}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
              }
              onClick={() => onCategoryClick?.(category)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

ShopCategories.displayName = 'ShopCategories';

export default ShopCategories;
