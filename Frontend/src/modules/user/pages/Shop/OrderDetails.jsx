import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiShoppingBag,
  FiRefreshCw,
  FiXCircle,
  FiTruck
} from 'react-icons/fi';
import shopService from '../../services/shopService';
import LogoLoader from '../../../../components/common/LogoLoader';
import { toast } from 'react-hot-toast';

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
      setLoading(true);
      const response = await shopService.getOrder(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error('Order not found');
        navigate('/user/shop');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LogoLoader /></div>;
  if (!order) return null;

  const statusColors = {
    'Pending': 'bg-yellow-500',
    'Processing': 'bg-blue-500',
    'Shipped': 'bg-indigo-500',
    'Delivered': 'bg-green-500',
    'Cancelled': 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
            <FiArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order Details</h1>
            <p className="text-xs text-gray-500">Order #{order.orderNumber}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${statusColors[order.orderStatus] || 'bg-gray-500'}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image || item.product?.images?.[0] ? (
                    <img src={item.image || item.product?.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><FiShoppingBag /></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name || item.product?.name || 'Product Info Unavailable'}</h3>
                  <p className="text-xs text-gray-500 mt-1">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FiMapPin className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">Shipping Address</h2>
          </div>
          {typeof order.shippingAddress === 'object' ? (
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-900 mb-1">{order.user?.name}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2 text-gray-500">Phone: {order.shippingAddress.phone || order.user?.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{order.shippingAddress || 'No address details'}</p>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">Payment Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-900">
                {order.paymentMethod === 'card' && 'Card'}
                {order.paymentMethod === 'cod' && 'Cash On Delivery'}
                {order.paymentMethod === 'bank' && 'Bank Transfer'}
                {!['card', 'cod', 'bank'].includes(order.paymentMethod) && (order.paymentMethod || 'N/A')}
              </span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tracking Number:</span>
                <span className="font-bold text-gray-900 font-mono tracking-wide">{order.trackingNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-medium">₹{order.subtotal || order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-900 font-medium">₹{order.shipping || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900 font-medium">₹{order.tax || 0}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-3">
              <span className="font-black text-gray-900 text-base">Total</span>
              <span className="font-black text-blue-600 text-lg">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {order.orderStatus === 'Pending' && (
            <button
              onClick={() => toast.error('Cancellation not implemented yet')}
              className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-xl transition-colors hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <FiXCircle /> Cancel Order
            </button>
          )}

          <button
            onClick={() => toast.success('Items added to cart')}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Reorder
          </button>

          <button
            onClick={() => navigate(`/user/shop/track/${order._id}`)}
            className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FiTruck /> Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
