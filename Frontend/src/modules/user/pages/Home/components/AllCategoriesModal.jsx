import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSearch, FiChevronRight } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { themeColors } from '../../../../../theme';

const toAssetUrl = (url) => {
  if (!url) return '';
  const clean = url.replace('/api/upload', '/upload');
  if (clean.startsWith('http')) return clean;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');
  return `${base}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

const AllCategoriesModal = React.memo(({ isOpen, onClose, categories, onCategoryClick }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* Modal Container - Full Height Side/Bottom Sheet Style */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-20 z-[9999] bg-white rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">All Categories</h2>
                <p className="text-xs text-gray-500 mt-1">Explore all our services</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-white shrink-0">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for a service category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Content - Two Column Grid with Modern Cards */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 gap-4">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onCategoryClick(category);
                      // We can choose to keep this open or close it. 
                      // Usually if it opens another modal (CategoryModal), we might want to close this one or layer them.
                      // For now, let's close this one so the CategoryModal can take focus.
                      handleClose();
                    }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer hover:border-teal-100 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center p-2.5">
                        <img
                          src={toAssetUrl(category.icon)}
                          alt={category.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[15px]">{category.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">View Services</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                      <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                    </div>
                  </motion.div>
                ))}

                {filteredCategories.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    No categories found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
});

AllCategoriesModal.displayName = 'AllCategoriesModal';

export default AllCategoriesModal;
