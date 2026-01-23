import React, { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiFilter, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import shopService from '../../services/shopService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shopService.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await shopService.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusIcons = {
    'Pending': <FiClock className="text-amber-500" />,
    'Processing': <FiClock className="text-blue-500" />,
    'Shipped': <FiTruck className="text-indigo-500" />,
    'Delivered': <FiCheckCircle className="text-green-500" />,
    'Cancelled': <FiXCircle className="text-red-500" />
  };

  const statusColors = {
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
    'Shipped': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Delivered': 'bg-green-50 text-green-700 border-green-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200'
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shop Orders</h1>
        <p className="text-gray-600 text-sm">Monitor and manage customer purchases</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Statuses</option>
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-primary-600 uppercase">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.user?.name || 'Guest User'}</span>
                        <span className="text-xs text-gray-500">{order.user?.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group/select">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`appearance-none pl-9 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 w-full transition-all 
                              ${statusColors[order.orderStatus] || 'bg-gray-50 border-gray-200 text-gray-700'}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`}>
                          {statusIcons[order.orderStatus]}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <FiEye className="group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Items List */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><FiPackage /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.product?.name || 'Removed Product'}</p>
                        <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-black text-primary-600 font-mono">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info & Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Customer & Delivery</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-800">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.phone}</p>
                    <p className="text-sm text-gray-600 mt-2 italic">
                      {selectedOrder.shippingAddress || 'No address provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Update Order Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.orderStatus === status}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedOrder.orderStatus === status
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:shadow-sm'
                          }`}
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 text-sm text-amber-700">
                    <FiClock className="flex-shrink-0 mt-0.5" />
                    <p>Current Status: <strong>{selectedOrder.orderStatus}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
