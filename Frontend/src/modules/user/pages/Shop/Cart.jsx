import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2, FiHeart, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ShopCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load shop cart specifically from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('shopCart', JSON.stringify(items));
    // Dispatch custom event to notify other components (like ShopPage badge)
    window.dispatchEvent(new Event('shopCartUpdated'));
  };

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
    toast.error('Item removed from cart');
  };

  const clearCart = () => {
    saveCart([]);
    toast.success('Cart cleared');
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden">
      {/* Header - As per image */}
      <header className="bg-white border-b border-gray-100 px-4 py-6 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-gray-50 rounded-full transition-colors"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Shopping Cart</h1>
      </header>

      {/* Cart Content - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide pb-32">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-gray-50/50 p-4 rounded-[32px] border border-gray-100 flex gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-100/50"
            >
              {/* Product Image */}
              <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight pr-4">{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 p-1 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-blue-500 font-black text-[17px] mb-1">₹{item.price.toLocaleString()}</p>

                {/* Inventory Alert */}
                <p className="text-orange-500 text-[11px] font-bold mb-3 flex items-center gap-1.5 px-2 py-0.5 bg-orange-50 w-fit rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Only 5 left!
                </p>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-[14px] px-2 py-1.5 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 active:scale-90"
                    >
                      <FiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[14px] font-black text-gray-800 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 active:scale-90"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Save for Later Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-500 rounded-2xl text-[12px] font-bold active:scale-95 transition-all">
                    <FiHeart className="w-3.5 h-3.5" />
                    Save for Later
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 border border-gray-100 relative">
              <FiShoppingBag className="w-10 h-10 text-gray-200" />
              <div className="absolute inset-0 rounded-[40px] border-2 border-dashed border-gray-100 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Cart is empty</h3>
            <p className="text-gray-400 text-[14px] font-medium max-w-[200px]">Looks like you haven't added anything to your shop cart yet.</p>
            <button
              onClick={() => navigate('/user/shop')}
              className="mt-8 px-8 py-3 bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all text-sm"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Delivery Features - Premium Touch */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pb-8">
            <div className="p-4 bg-blue-50/50 rounded-3xl border border-blue-50 flex flex-col items-center text-center gap-2">
              <FiTruck className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Free Express Delivery</span>
            </div>
            <div className="p-4 bg-green-50/50 rounded-3xl border border-green-50 flex flex-col items-center text-center gap-2">
              <FiShield className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Secure Checkout</span>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Footer Actions - As per image */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="p-6 border-t border-gray-100 bg-white space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] sticky bottom-0"
          >
            <div className="flex items-center justify-between px-2">
              <span className="text-gray-500 font-bold text-lg">Total:</span>
              <span className="text-2xl font-black text-blue-500">₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate('/user/shop/checkout')}
              className="w-full py-4 bg-blue-500 text-white rounded-3xl font-black text-[16px] shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Proceed to Checkout
              <FiArrowLeft className="w-5 h-5 rotate-180" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-gray-400 text-[11px] font-black uppercase tracking-[3px] hover:text-red-400 transition-colors py-2"
            >
              Clear Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopCartPage;
