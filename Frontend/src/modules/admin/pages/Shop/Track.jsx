import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiTruck, FiPackage, FiClipboard, FiClock, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import shopService from '../../services/shopService';
import { toast } from 'react-hot-toast';

const Track = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using getAllOrders for now, might need filter params later
        const res = await shopService.getAllOrders({ search: debouncedSearch });
        if (res.success) {
          // Client-side filtering if search is active (since API might not support it fully yet)
          let data = res.data;
          if (debouncedSearch) {
            const lowerSearch = debouncedSearch.toLowerCase();
            data = data.filter(o =>
              o.orderNumber?.toLowerCase().includes(lowerSearch) ||
              o.user?.name?.toLowerCase().includes(lowerSearch)
            );
          }
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-600';
      case 'Shipped': return 'bg-indigo-500';
      case 'Processing': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const steps = [
    { title: 'Order Placed', icon: FiShoppingBag, key: 'Pending' },
    { title: 'Processing', icon: FiClipboard, key: 'Processing' },
    { title: 'Shipped', icon: FiTruck, key: 'Shipped' },
    { title: 'Delivered', icon: FiCheckCircle, key: 'Delivered' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shop Order Tracking</h1>
          <p className="text-gray-600 text-sm">Track shipment status of shop orders</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Order Number or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-250px)]">
        {/* Left: Orders Table */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-gray-50/50">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ORDER ID</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?._id === order._id ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4">
                        <span className="font-semibold text-gray-800 text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{order.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email || order.user?.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide
                                    ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-lg font-medium text-xs transition-colors"
                        >
                          Track
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Tracking Details Panel */}
        <AnimatePresence mode='wait'>
          {selectedOrder ? (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-y-auto"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Tracking Details</h2>

              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="text-lg font-bold text-gray-900">{selectedOrder.orderNumber}</p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-xs text-blue-500 font-mono mt-1">TRK: {selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const res = await shopService.updateOrderStatus(selectedOrder._id, { orderStatus: newStatus });
                          if (res.success) {
                            toast.success(`Status updated to ${newStatus}`);
                            const updatedOrder = { ...selectedOrder, orderStatus: newStatus };
                            setSelectedOrder(updatedOrder);
                            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                          }
                        } catch (err) {
                          toast.error('Failed to update status');
                        }
                      }}
                      className={`text-xs font-bold uppercase py-1 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
                           ${selectedOrder.orderStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          selectedOrder.orderStatus === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            selectedOrder.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              selectedOrder.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-red-50 text-red-700 border-red-200'
                        }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1">Customer</p>
                <p className="text-base font-semibold text-gray-900">{selectedOrder.user?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{selectedOrder.shippingAddress || 'No address'}</p>
              </div>

              {/* Timeline */}
              <div className="flex-1 relative pl-4 border-l-2 border-gray-100 space-y-8 mb-8">
                {steps.map((step, index) => {
                  const currentStepIdx = getStatusStep(selectedOrder.orderStatus);
                  const isCompleted = currentStepIdx !== -1 && index <= currentStepIdx;
                  const isCancelled = selectedOrder.orderStatus === 'Cancelled';

                  return (
                    <div key={index} className="relative pl-6">
                      {/* Dot */}
                      <div className={`absolute -left-[23px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${isCancelled ? 'bg-red-50 border-red-500 text-red-600' :
                          isCompleted ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-300'}
                      `}>
                        <step.icon className="w-4 h-4" />
                      </div>

                      <div>
                        <h3 className={`text-sm font-semibold ${isCancelled ? 'text-gray-900' :
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                          {step.title}
                        </h3>
                        {/* Only show "Completed" label if actually reached */}
                        <p className={`text-xs ${isCancelled ? 'text-red-500' :
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`}>
                          {isCancelled ? (index === currentStepIdx ? 'Cancelled' : '') : isCompleted ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => navigate(`/admin/shop/orders/${selectedOrder._id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  View Full Details
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center h-full text-center text-gray-500">
              <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
              <p>Select an order to view tracking details</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Track;
