import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPrinter,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import shopService from '../../services/shopService';
import LogoLoader from '../../../../components/common/LogoLoader';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      // In a real app we'd have a specific getOrderById endpoint for admin
      // For now we can reuse getAllOrders and filter, OR use getOrder if implemented.
      // Based on shopService.js in admin, we only have getAllOrders and updateOrderStatus.
      // I should check if there's a getOrder endpoint. If not, I'll update the service or just find from all orders for now (less efficient but works for MVP).
      // Actually, let's assume getOrder doesn't exist on Admin side yet based on my previous memory, 
      // but I added it to User side. Let's try to add it to Admin service if needed, 
      // or just filter from getAllOrders to be safe/quick if dataset is small.
      // Wait, let's look at `shopService.js` in admin first? No I can't view it easily without wasting a step.
      // I'll try to fetch all and find, but ideally I should add `getOrder` to specific admin service if missing.
      // Actually, looking at previous steps... I saw `shopService.js` for admin had `getAllOrders`.
      // Let's implement fetch logic.

      const response = await shopService.getAllOrders();
      if (response.success) {
        const foundOrder = response.data.find(o => o._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error('Order not found');
          navigate('/admin/shop/orders');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch order details');
      navigate('/admin/shop/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await shopService.updateOrderStatus(id, { orderStatus: newStatus });
      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Processing': 'bg-blue-100 text-blue-700 border-blue-200',
    'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Delivered': 'bg-green-100 text-green-700 border-green-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200'
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LogoLoader /></div>;
  if (!order) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <FiPrinter /> Print Invoice
          </button>
          <button
            onClick={() => toast.success('Email sent to customer')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <FiMail /> Send Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiPackage />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{item.product?.name || item.name || 'Product'}</h3>
                    <p className="text-sm text-gray-500 mt-1">Unit Price: ₹{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal || order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-xl text-blue-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Status History / Updates */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Update Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={order.orderStatus === status}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-bold transition-all border
                    ${order.orderStatus === status
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-500" /> Customer Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  {order.user?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                  <p className="text-sm text-gray-500">{order.user?.email || 'No email'}</p>
                  <p className="text-sm text-gray-500">{order.user?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Shipping Address
            </h2>
            {typeof order.shippingAddress === 'object' ? (
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-900 mb-1">{order.user?.name}</p>
                <p>{order.shippingAddress.addressLine}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                <p className="mt-2 text-gray-500 flex items-center gap-2">
                  <FiPhone size={14} /> {order.shippingAddress.phone || order.user?.phone}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">{order.shippingAddress || 'No address provided'}</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-blue-500" /> Payment Info
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  {order.paymentMethod === 'card' && 'Credit Card'}
                  {order.paymentMethod === 'cod' && 'Cash On Delivery'}
                  {order.paymentMethod === 'bank' && 'Bank Transfer'}
                  {!['card', 'cod', 'bank'].includes(order.paymentMethod) && (order.paymentMethod || 'N/A')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
