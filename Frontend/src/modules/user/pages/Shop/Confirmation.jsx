import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiEye,
  FiTruck,
  FiShoppingBag,
  FiArrowRight
} from 'react-icons/fi';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails } = location.state || {};

  useEffect(() => {
    if (!orderDetails) {
      navigate('/user/shop');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Top Gradient Background */}
      <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent absolute inset-0 -z-10" />

      <main className="max-w-md mx-auto px-6 pt-16 flex flex-col items-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-200 mb-8"
        >
          <FiCheck className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title & Message */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-gray-900 mb-3"
        >
          Order Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-500 font-medium leading-relaxed px-4 mb-10"
        >
          Thank you for your purchase. Your order has been received and is being processed.
        </motion.p>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] w-full p-8 shadow-sm border border-gray-100 flex flex-col items-center mb-6"
        >
          <span className="text-gray-400 text-sm font-bold mb-1">Order Number</span>
          <h3 className="text-gray-900 font-black text-lg mb-6">{orderDetails.orderNumber}</h3>

          <span className="text-gray-400 text-sm font-bold mb-1">Tracking Number</span>
          <h3 className="text-blue-500 font-black text-lg mb-8 tracking-wide">{orderDetails.trackingNumber}</h3>

          <div className="w-full h-[1px] bg-gray-50 mb-6" />

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400">Order Date</span>
              <span className="text-gray-900">{orderDetails.date}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-blue-500 font-black text-base">₹{orderDetails.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-gray-900">{orderDetails.paymentMethod}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Items Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[32px] w-full p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-gray-900 font-black text-base mb-4 ml-1">Order Items</h3>
          <div className="space-y-4">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-bold text-[14px] truncate">{item.name}</h4>
                  <p className="text-gray-400 text-xs font-bold">₹{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <div className="text-gray-900 font-black text-[14px]">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={() => navigate(`/user/shop/orders/${orderDetails.orderId}`)}
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-[16px] shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <FiEye className="w-5 h-5" />
            View Order Details
          </button>

          <button
            onClick={() => navigate(`/user/shop/track/${orderDetails.orderId}`)}
            className="w-full py-4 bg-white text-gray-700 rounded-2xl font-black text-[15px] border border-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <FiTruck className="w-5 h-5 text-gray-400" />
            Track Order
          </button>

          <button
            onClick={() => navigate('/user/shop')}
            className="w-full py-4 bg-white text-gray-400 rounded-2xl font-black text-[14px] uppercase tracking-widest active:scale-95 transition-all text-center"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
