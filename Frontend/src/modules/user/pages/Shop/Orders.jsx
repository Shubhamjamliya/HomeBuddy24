import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast'; // Assuming this is used
import shopService from '../../services/shopService';
import LogoLoader from '../../../../components/common/LogoLoader';
import { motion } from 'framer-motion';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shopService.getMyOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        toast.error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    'Pending': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FiClock },
    'Processing': { color: 'text-blue-600', bg: 'bg-blue-50', icon: FiPackage },
    'Shipped': { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: FiTruck },
    'Delivered': { color: 'text-green-600', bg: 'bg-green-50', icon: FiCheckCircle },
    'Cancelled': { color: 'text-red-600', bg: 'bg-red-50', icon: FiXCircle },
  };

  const getStatusStyle = (status) => {
    return statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-50', icon: FiPackage };
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LogoLoader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate('/user/shop')}
            className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate('/user/shop')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = getStatusStyle(order.orderStatus).icon;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/user/shop/orders/${order._id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Order #{order.orderNumber}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 ${getStatusStyle(order.orderStatus).bg}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${getStatusStyle(order.orderStatus).color}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(order.orderStatus).color}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Preview of first item */}
                  {order.items && order.items.length > 0 && (
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        {order.items[0].image || (order.items[0].product && order.items[0].product.images && order.items[0].product.images[0]) ? (
                          <img
                            src={order.items[0].image || order.items[0].product.images[0]}
                            alt={order.items[0].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiPackage />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.items[0].name || (order.items[0].product && order.items[0].product.name) || 'Product'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.length > 1 ? `+ ${order.items.length - 1} more items` : `Qty: ${order.items[0].quantity}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Total Amount</span>
                    <span className="text-sm font-bold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default Orders;
