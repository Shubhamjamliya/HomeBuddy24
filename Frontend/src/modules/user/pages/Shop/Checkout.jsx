import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiTruck,
  FiMapPin,
  FiPlus,
  FiCheck,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiGlobe,
  FiNavigation
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ShopCheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    email: 'harshvardhanpanc145@gmail.com',
    phone: '1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const savedAddresses = [
    {
      id: 1,
      label: 'Home',
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    },
    {
      id: 2,
      label: 'Work',
      name: 'John Doe',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    const orderDetails = {
      orderNumber: `ORD-${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
      trackingNumber: `TRK${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      total: total,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'cod' ? 'Cash On Delivery' : 'Bank Transfer',
      items: cartItems
    };

    toast.success('Order placed successfully!', {
      icon: '🎉',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
    localStorage.removeItem('shopCart');
    window.dispatchEvent(new Event('shopCartUpdated'));
    navigate('/user/shop/confirmation', { state: { orderDetails } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-50">
        <button
          onClick={() => step === 1 ? navigate(-1) : setStep(1)}
          className="p-1 hover:bg-gray-50 rounded-full transition-colors"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Checkout</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Stepper */}
        <div className="bg-white py-8 px-10 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center w-full max-w-xs relative">
            <div className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                {step > 1 ? <FiCheck className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-[11px] font-bold mt-2 ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>Address</span>
            </div>

            <div className="flex-1 h-[3px] bg-gray-100 mx-2 -mt-6 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: step > 1 ? '100%' : '0%' }}
                className="absolute inset-0 bg-blue-500"
              />
            </div>

            <div className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= 2 ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                2
              </div>
              <span className={`text-[11px] font-bold mt-2 ${step >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>Payment</span>
            </div>
          </div>
        </div>

        <div className="p-6 pb-32">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Saved Addresses Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiMapPin className="w-6 h-6 text-blue-500" />
                    <h2 className="text-lg font-black text-gray-900">Saved Addresses</h2>
                  </div>
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`w-full text-left p-5 rounded-[28px] border-2 transition-all flex items-start gap-4 ${selectedAddress === addr.id
                        ? 'border-blue-500 bg-blue-50/30'
                        : 'border-white bg-white hover:border-gray-100 shadow-sm'
                        }`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedAddress === addr.id ? 'border-blue-500 bg-blue-500' : 'border-gray-200'
                        }`}>
                        {selectedAddress === addr.id && <FiCheck className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-black text-gray-900">{addr.label}</span>
                        </div>
                        <p className="text-gray-500 text-[13px] font-bold leading-relaxed">
                          {addr.name}<br />
                          {addr.address}<br />
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Details Form from Image */}
                <div className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600 ml-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600 ml-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600 ml-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600 ml-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Payment Methods */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiCreditCard className="w-6 h-6 text-blue-500" />
                    <h2 className="text-lg font-black text-gray-900">Payment Method</h2>
                  </div>

                  {[
                    { id: 'card', label: 'Credit/Debit Card' },
                    { id: 'cod', label: 'Cash On Delivery' },
                    { id: 'bank', label: 'Bank Transfer' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-5 rounded-[20px] border-2 transition-all flex items-center gap-4 ${paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-white bg-white hover:border-gray-100 shadow-sm'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-blue-500' : 'border-gray-200'
                        }`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <span className="font-bold text-gray-800 text-[15px]">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="space-y-4">
                  <span className="text-sm font-black text-gray-900">Coupon Code</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-5 py-4 bg-white border border-gray-100 rounded-2xl text-[14px] font-bold text-gray-700 shadow-sm"
                    />
                    <button className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-black text-[14px] active:scale-95 transition-all shadow-lg shadow-blue-100">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-[16px] font-black text-gray-900 mb-2">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold text-[14px]">Subtotal</span>
                      <span className="text-gray-900 font-black text-[14px]">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold text-[14px]">Shipping</span>
                      <span className="text-green-500 font-black text-[14px]">FREE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold text-[14px]">Tax</span>
                      <span className="text-gray-900 font-black text-[14px]">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-[1px] bg-gray-50 my-2" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-black text-[18px]">Total</span>
                    <span className="text-blue-500 font-black text-[18px]">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Buttons */}
      <div className="p-6 bg-white border-t border-gray-100 flex gap-4 sticky bottom-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-[16px] active:scale-95 transition-all"
          >
            Back
          </button>
        )}
        <button
          onClick={step === 1 ? () => setStep(2) : handlePlaceOrder}
          className={`${step === 1 ? 'w-full' : 'flex-[2.5]'} py-4 bg-blue-500 text-white rounded-2xl font-black text-[16px] shadow-2xl shadow-blue-200 active:scale-95 transition-all`}
        >
          {step === 1 ? 'Continue' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default ShopCheckoutPage;
