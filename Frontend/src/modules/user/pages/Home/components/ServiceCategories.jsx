import React from 'react';
import CategoryCard from '../../../components/common/CategoryCard';
import electricianIcon from '../../../../../assets/images/icons/services/electrician.png';
import womensSalonIcon from '../../../../../assets/images/icons/services/womens-salon-spa-icon.png';
import massageMenIcon from '../../../../../assets/images/icons/services/massage-men-icon.png';
import cleaningIcon from '../../../../../assets/images/icons/services/cleaning-icon.png';
import electricianPlumberIcon from '../../../../../assets/images/icons/services/electrician-plumber-carpenter-icon.png';
import acApplianceRepairIcon from '../../../../../assets/images/icons/services/ac-appliance-repair-icon.png';

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

  const serviceCategories = categories.map((cat) => ({
    ...cat,
    icon: toAssetUrl(cat.icon || cat.image),
  }));

  return (
    <div className="">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-5">
        <h2 className="text-[19px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Categories
          {/* <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">Explore</span> */}
        </h2>
      </div>

      {/* Scrollable Container with better padding */}
      <div
        className="flex gap-1 overflow-x-auto pb-4 px-4 scrollbar-hide -mx-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {serviceCategories.map((category, index) => {
          const iconSrc = toAssetUrl(category.icon || category.image);
          return (
            <div key={category.id} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <CategoryCard
                title={category.title}
                icon={
                  <img
                    src={iconSrc}
                    alt={category.title}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                }
                onClick={() => onCategoryClick?.(category)}
                hasSaleBadge={category.hasSaleBadge}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

ServiceCategories.displayName = 'ServiceCategories';

export default ServiceCategories;

