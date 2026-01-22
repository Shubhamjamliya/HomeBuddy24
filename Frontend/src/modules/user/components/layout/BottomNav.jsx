import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiShoppingBag,
  FiShoppingCart,
  FiUser
} from 'react-icons/fi';
import { themeColors } from '../../../../theme';
import { motion } from 'framer-motion';

const BottomNav = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from backend
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const { cartService } = await import('../../../../services/cartService');
        const response = await cartService.getCart();
        if (response.success) {
          setCartCount((response.data || []).length);
        }
      } catch (error) {
        console.error('Failed to load cart count', error);
      }
    };

    loadCartCount();
    const handleFocus = () => loadCartCount();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: FiHome, path: '/user' },
    { id: 'bookings', label: 'Bookings', icon: FiCalendar, path: '/user/my-bookings' },
    { id: 'shop', label: 'Shop', icon: FiShoppingBag, path: '/user/shop' },
    { id: 'cart', label: 'Cart', icon: FiShoppingCart, path: '/user/cart', isCart: true },
    { id: 'account', label: 'Account', icon: FiUser, path: '/user/account' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/user' || path === '/user/') return 'home';
    if (path.startsWith('/user/my-bookings')) return 'bookings';
    if (path.startsWith('/user/shop')) return 'shop';
    if (path.startsWith('/user/cart')) return 'cart';
    if (path.startsWith('/user/account')) return 'account';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe">
      <div className="max-w-md mx-auto px-6 h-[68px] flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 transition-all duration-300 group outline-none"
            >
              <div className="relative flex flex-col items-center gap-1">
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                  />

                  {item.isCart && cartCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white"
                    >
                      {cartCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-bold tracking-tight transition-all duration-150 ${isActive ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-400 scale-95 opacity-80'}`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabSlot"
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-blue-600"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;

