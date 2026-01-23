import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import shopService from '../../services/shopService';

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Imported
  const [activeCategory, setActiveCategory] = useState(location.state?.initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [flyingItems, setFlyingItems] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All', icon: '🏪', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=100' }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync cart count
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Check for legacy cart items (numeric IDs) and clear them
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const hasLegacyItems = items.some(item => typeof item.id === 'number' || (typeof item.id === 'string' && item.id.length < 10));
        if (hasLegacyItems) {
          localStorage.removeItem('shopCart');
          setCartCount(0);
          console.log('Cleared legacy cart items');
        } else {
          updateCartCount();
        }
      } catch (e) {
        localStorage.removeItem('shopCart');
      }
    }

    window.addEventListener('shopCartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('shopCartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Fetch Data
  // Fetch Categories
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const catRes = await shopService.getCategories();
        if (isMounted && catRes.success) {
          const mappedCats = (catRes.data || []).map(c => ({
            id: c._id,
            name: c.name,
            icon: c.icon || '📦',
            image: c.icon || c.image
          }));
          setCategories(prev => [
            { id: 'all', name: 'All', icon: '🏪', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=100' },
            ...mappedCats
          ]);
        }
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Fetch Products
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const prodRes = await shopService.getProducts({ limit: 100 });
        if (isMounted) {
          if (prodRes.success) {
            const productsData = prodRes.data || prodRes.products || [];
            const mappedProds = productsData.map(p => ({
              id: p._id,
              name: p.name,
              category: p.category?.name || 'Uncategorized',
              price: p.price,
              originalPrice: p.originalPrice,
              rating: p.rating || 0,
              reviews: p.reviewsCount || 0,
              image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'https://via.placeholder.com/150'),
              tag: p.tag || (p.price > 10000 ? 'Premium' : 'Popular'),
              description: p.description
            }));
            setProducts(mappedProds);
          } else {
            // If failure, don't crash, just show empty or previous
            console.error("Product fetch failed:", prodRes);
          }
        }
      } catch (error) {
        console.error('Failed to load products', error);
        toast.error('Failed to load shop data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const handleAddToCart = (e, p) => {
    // Get button position for animation start
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Trigger animation
    const animationId = Date.now();
    setFlyingItems(prev => [...prev, { id: animationId, x: startX, y: startY, image: p.image }]);

    // Update localStorage
    const savedCart = localStorage.getItem('shopCart');
    let items = savedCart ? JSON.parse(savedCart) : [];
    const existing = items.find(item => item.id === p.id);
    if (existing) {
      items = items.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      items.push({ ...p, quantity: 1 });
    }
    localStorage.setItem('shopCart', JSON.stringify(items));

    // Remove animation element and update count after delay
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== animationId));
      updateCartCount();
      toast.success(`${p.name} added!`, {
        icon: '🛒',
        style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px' },
        position: 'bottom-center'
      });
    }, 800);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery, products]);

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
                ? 'border-blue-500 shadow-lg shadow-blue-100 scale-105'
                : 'border-white group-hover:border-gray-200'
                }`}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                {!cat.icon?.startsWith('http') && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center text-lg">{cat.icon}</div>
                )}
              </div>
              <span className={`text-[10px] font-bold text-center px-1 leading-tight ${activeCategory === cat.name ? 'text-blue-500' : 'text-gray-500'
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
                  className="bg-gray-50 rounded-[28px] overflow-hidden border border-gray-100 flex flex-col group cursor-pointer"
                  onClick={() => navigate(`/user/shop/product/${p.id}`)}
                >
                  <div className="relative aspect-[1/1] bg-white rounded-b-[24px] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                      <FiHeart className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded-full uppercase tracking-tighter shadow-sm">
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(e, p);
                      }}
                      className="w-full py-2 bg-blue-500 text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
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

      {/* Floating Shop Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => navigate('/user/shop/cart')}
            className="fixed bottom-24 right-5 w-16 h-16 bg-blue-500 rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-transform"
          >
            <FiShoppingBag className="w-7 h-7 text-white" />
            <div className="absolute top-0 -right-1 w-6 h-6 bg-yellow-400 text-gray-900 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {cartCount}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Flying Animation Elements */}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{
              x: item.x - 20,
              y: item.y - 20,
              scale: 1,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              x: window.innerWidth - 60, // Targeting bottom right
              y: window.innerHeight - 100,
              scale: 0.1,
              opacity: 0,
              rotate: 45
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1] // Custom bezier for natural "toss" effect
            }}
            className="fixed top-0 left-0 w-10 h-10 rounded-full overflow-hidden z-[100] border-2 border-blue-500 shadow-xl pointer-events-none"
          >
            <img src={item.image} alt="flying" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
