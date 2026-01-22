import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiStar,
  FiGrid,
  FiList,
  FiPlus,
  FiHeart,
  FiShoppingBag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors } from '../../../../theme';

const ShopPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'All', icon: '🏪', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Appliances', icon: '📺', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'Cleaning', icon: '🧹', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'Security', icon: '🔒', image: 'https://images.unsplash.com/photo-1558002038-103590318282?auto=format&fit=crop&q=80&w=100' },
    { id: 5, name: 'Smart Home', icon: '🏠', image: 'https://images.unsplash.com/photo-1550524514-966953390111?auto=format&fit=crop&q=80&w=100' },
    { id: 6, name: 'Electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1526733169359-ab1142275022?auto=format&fit=crop&q=80&w=100' },
  ];

  const products = [
    {
      id: 1,
      name: 'Mi Smart Air Purifier 4',
      category: 'Appliances',
      price: 14999,
      originalPrice: 19999,
      rating: 4.8,
      reviews: 1250,
      image: 'https://images.unsplash.com/photo-1585771724684-252702224483?auto=format&fit=crop&q=80&w=400',
      tag: 'Best Seller'
    },
    {
      id: 2,
      name: 'Dyson V12 Detect Slim',
      category: 'Cleaning',
      price: 45900,
      originalPrice: 52900,
      rating: 4.9,
      reviews: 850,
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400',
      tag: 'Premium'
    },
    {
      id: 3,
      name: 'Ring Video Doorbell',
      category: 'Security',
      price: 8999,
      originalPrice: 12999,
      rating: 4.7,
      reviews: 3200,
      image: 'https://images.unsplash.com/photo-1558002038-103590318282?auto=format&fit=crop&q=80&w=400',
      tag: 'Top Rated'
    },
    {
      id: 4,
      name: 'Philips Hue Smart Bulb',
      category: 'Smart Home',
      price: 2499,
      originalPrice: 3500,
      rating: 4.6,
      reviews: 5400,
      image: 'https://images.unsplash.com/photo-1550524514-966953390111?auto=format&fit=crop&q=80&w=400',
      tag: 'Popular'
    },
    {
      id: 5,
      name: 'Samsung 9kg Washer',
      category: 'Appliances',
      price: 36990,
      originalPrice: 42000,
      rating: 4.5,
      reviews: 1100,
      image: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e04?auto=format&fit=crop&q=80&w=400',
      tag: 'New'
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col h-screen overflow-hidden">
      {/* Static Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
            <FiArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">{activeCategory === 'All' ? 'HomeBuddy Shop' : activeCategory}</h1>
            <span className="text-[12px] text-gray-400 font-medium">{filteredProducts.length} items found</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-600">
            <FiSearch className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-600">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Vertical Categories */}
        <aside className="w-[85px] bg-[#F8FAFC] border-r border-gray-100 overflow-y-auto scrollbar-hide flex flex-col items-center py-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className="flex flex-col items-center gap-1.5 group transition-all"
            >
              <div className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${activeCategory === cat.name
                  ? 'border-blue-600 shadow-lg shadow-blue-100 scale-105'
                  : 'border-white group-hover:border-gray-200'
                }`}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center text-lg">{cat.icon}</div>
              </div>
              <span className={`text-[10px] font-bold text-center px-1 leading-tight ${activeCategory === cat.name ? 'text-blue-600' : 'text-gray-500'
                }`}>
                {cat.name}
              </span>
            </button>
          ))}
        </aside>

        {/* Right Content Area: Product Grid */}
        <main className="flex-1 bg-white overflow-y-auto p-4 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 rounded-[28px] overflow-hidden border border-gray-100 flex flex-col group"
                >
                  <div className="relative aspect-[1/1] bg-white rounded-b-[24px] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                      <FiHeart className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full uppercase tracking-tighter shadow-sm">
                      {p.tag}
                    </div>
                  </div>
                  <div className="p-3 flex flex-col">
                    <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-2.5 line-clamp-2 h-[32px]">{p.name}</h4>

                    <div className="flex items-center gap-1 mb-2">
                      <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-[10px] font-bold text-gray-700">{p.rating}</span>
                      <span className="text-[10px] text-gray-400">({p.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[14px] font-black text-gray-900">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-100 active:scale-95 transition-all">
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiGrid className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-500 font-bold">No products found</p>
              <p className="text-gray-400 text-xs mt-1">Try another category</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
