import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiLoader,
  FiBell,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiChevronRight
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors } from '../../../../theme';
import { userAuthService } from '../../../../services/authService';
import { cartService } from '../../../../services/cartService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import Service Icons
import electricianIcon from '../../../../assets/images/icons/services/electrician.png';
import womensSalonIcon from '../../../../assets/images/icons/services/womens-salon-spa-icon.png';
import massageMenIcon from '../../../../assets/images/icons/services/massage-men-icon.png';
import cleaningIcon from '../../../../assets/images/icons/services/cleaning-icon.png';
import acApplianceRepairIcon from '../../../../assets/images/icons/services/ac-appliance-repair-icon.png';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from backend
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const response = await cartService.getCart();
        if (response.success) {
          setCartItems(response.data || []);
        } else {
          toast.error(response.message || 'Failed to load cart');
          setCartItems([]);
        }
      } catch (error) {
        toast.error('Failed to load cart');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Electrician': electricianIcon,
      'Electricity': electricianIcon,
      "Women's Salon & Spa": womensSalonIcon,
      'Salon for Women': womensSalonIcon,
      'Salon Prime': womensSalonIcon,
      'Massage for Men': massageMenIcon,
      'Cleaning': cleaningIcon,
      'Bathroom & Kitchen Cleaning': cleaningIcon,
      'Sofa & Carpet Cleaning': cleaningIcon,
      'AC Service and Repair': acApplianceRepairIcon,
      'AC & Appliance Repair': acApplianceRepairIcon,
    };
    return iconMap[category] || electricianIcon; // Default icon
  };

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [cartItems]);

  const cartCount = cartItems.length;

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Remove all items from ${category}?`)) return;
    try {
      const response = await cartService.removeCategoryItems(category);
      if (response.success) {
        setCartItems(response.data || []);
        toast.success('Category removed');
      } else {
        toast.error(response.message || 'Failed to remove');
      }
    } catch (error) {
      toast.error('Failed to remove category');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await cartService.removeItem(itemId);
      if (response.success) {
        setCartItems(response.data || []);
        toast.success('Item removed');
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddServices = (category) => {
    // Navigate to dynamic service page using category slug
    const slugMap = {
      'Electrician': 'electrician-services',
      'Electricity': 'electrician-services',
      "Women's Salon & Spa": 'salon-for-women',
      'Salon for Women': 'salon-for-women',
      'Salon Prime': 'salon-for-women',
      'Massage for Men': 'massage-for-men',
      'Bathroom & Kitchen Cleaning': 'bathroom-kitchen-cleaning',
      'Sofa & Carpet Cleaning': 'sofa-carpet-cleaning',
      'AC Service and Repair': 'ac-service',
      'AC & Appliance Repair': 'ac-service',
    };
    const slug = slugMap[category] || category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/user/${slug}`);
  };

  const handleCategoryCheckout = (category) => {
    navigate('/user/checkout', { state: { category: category } });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative pb-24 font-sans text-gray-900">
      {/* Dynamic Background - compacted height */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[40vh] bg-[#F1F5F9]"
          style={{
            background: 'radial-gradient(at 0% 0%, #E0F2FE 0%, transparent 70%), radial-gradient(at 100% 0%, #FAE8FF 0%, transparent 70%), #F8FAFC'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header - slightly more compact */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="p-2 bg-white rounded-full hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <FiArrowLeft className="w-4 h-4 text-gray-700" />
            </motion.button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">My Cart</h1>
              <p className="text-[10px] text-gray-500 font-medium">Review your services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100 flex items-center gap-1">
              <FiShield className="w-3 h-3" /> Secure
            </div>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-3 pt-4 max-w-xl mx-auto space-y-3"
        >
          {cartItems.length === 0 ? (
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/10 mb-5 border-4 border-blue-50">
                <FiShoppingCart className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Looks like you haven't added any services yet.</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/user')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
              >
                Explore Services <FiChevronRight />
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {Object.entries(groupedItems).map(([category, items]) => {
                const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
                const categoryIcon = getCategoryIcon(category);
                const serviceCount = items.reduce((sum, item) => sum + (item.serviceCount || 1), 0);

                return (
                  <motion.div
                    key={category}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:border-blue-200 transition-all"
                  >
                    {/* Compact Category Header */}
                    <div className="p-4 pb-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 p-1.5">
                            <img src={categoryIcon} alt={category} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">{category}</h2>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                              {serviceCount} Items • <span className="text-blue-600 font-bold">₹{categoryTotal}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Compact Services List */}
                    <div className="px-4 space-y-2 mb-3">
                      {items.map((item) => (
                        <motion.div
                          key={item._id || item.id}
                          layout
                          className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-xl border border-gray-100/80 hover:bg-blue-50/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <h3 className="font-semibold text-gray-900 text-[13px] leading-snug truncate pr-2">
                                {item.title}
                              </h3>
                              <span className="font-bold text-gray-900 text-xs shrink-0">₹{item.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-gray-500 font-medium bg-white px-1.5 py-0.5 rounded border border-gray-100">x{item.serviceCount || 1}</span>
                              <button
                                onClick={() => handleDelete(item._id || item.id)}
                                className="text-[10px] text-red-400 hover:text-red-600 font-medium transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Compact Footer Actions */}
                    <div className="px-4 pb-4 pt-2 bg-gradient-to-b from-white to-gray-50/30">
                      <div className="flex justify-between items-center mb-3 px-1 border-t border-dashed border-gray-100 pt-2">
                        <span className="text-xs text-gray-500 font-medium">Subtotal</span>
                        <span className="text-sm font-black text-gray-900">₹{categoryTotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAddServices(category)}
                          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all"
                        >
                          + Add
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleCategoryCheckout(category)}
                          className="flex-[1.5] bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-all"
                        >
                          Checkout <FiChevronRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Compact Safety Badge */}
          {cartItems.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur rounded-xl p-3 flex items-center justify-center gap-2 border border-blue-50">
              <FiCheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-[10px] text-gray-500 font-medium">100% Secure Checkout & Verified Professionals</p>
            </motion.div>
          )}

        </motion.main>
      </div>
    </div>
  );
};

export default Cart;
