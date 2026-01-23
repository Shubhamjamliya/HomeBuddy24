import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShoppingBag
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import shopService from '../../services/shopService';
import LogoLoader from '../../../../components/common/LogoLoader';
import { toast } from 'react-hot-toast';

const Track = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await shopService.getOrder(id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LogoLoader /></div>;
  if (!order) return <div className="h-screen flex items-center justify-center text-gray-500">Order not found</div>;

  const steps = [
    { status: 'Pending', label: 'Order Placed', icon: FiPackage },
    { status: 'Processing', label: 'Processing', icon: FiClock },
    { status: 'Shipped', label: 'Shipped', icon: FiTruck },
    { status: 'Delivered', label: 'Delivered', icon: FiCheckCircle }
  ];

  const getStatusIndex = (status) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(order.orderStatus);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">Track Order</h1>
          <p className="text-xs text-gray-500">Order #{order.orderNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-amber-100 text-amber-700'
          }`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="relative pl-2">
            {/* Vertical Line */}
            <div className="absolute top-2 left-[19px] bottom-6 w-[2px] bg-gray-100 -z-0"></div>

            {/* Active Line Segment - Approximate */}
            <div
              className="absolute top-2 left-[19px] w-[2px] bg-blue-500 transition-all duration-1000 -z-0"
              style={{ height: `${Math.max(0, Math.min(100, (currentStatusIndex / (steps.length - 1)) * 100))}%` }}
            ></div>

            <div className="space-y-8 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={index} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${isCompleted
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200'
                      : 'bg-white border-gray-200 text-gray-300'
                      }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <h3 className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isCompleted && index === 0 ? formatDate(order.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Tracking Number</h2>
            <div className="flex items-center justify-between">
              <p className="text-lg font-mono font-bold text-blue-600 tracking-wider select-all">
                {order.trackingNumber}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(order.trackingNumber);
                  toast.success('Copied!');
                }}
                className="text-xs text-gray-400 font-medium hover:text-blue-500"
              >
                COPY
              </button>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FiMapPin className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">Shipping Address</h2>
          </div>
          <div className="pl-6 border-l-2 border-gray-100 py-1">
            <p className="font-bold text-gray-800 text-sm">{order.user?.name}</p>
            {typeof order.shippingAddress === 'object' ? (
              <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                <p>{order.shippingAddress.addressLine}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">{order.shippingAddress || 'Address not listed'}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FiShoppingBag className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image || item.product?.images?.[0] ? (
                    <img src={item.image || item.product?.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{item.name || item.product?.name || 'Product Info Unavailable'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Estimated Delivery</h2>
            <p className="text-xs text-gray-400 mt-1">Based on shipping method</p>
          </div>
          <div className="text-right">
            <span className="text-blue-600 font-bold">
              {/* Fake calculation for demo */}
              Jan 27, 2026
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => navigate(`/user/shop/orders/${order._id}`)}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 mt-4 active:scale-95 transition-transform"
        >
          View Order Details
        </button>
      </div>
    </div>
  );
};

export default Track;
