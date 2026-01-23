import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiStar,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiShoppingBag,
  FiCheck,
  FiTruck,
  FiShield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import shopService from '../../services/shopService';
import LogoLoader from '../../../../components/common/LogoLoader';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProduct();
    updateCartCount();
  }, [id]);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await shopService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        toast.error('Product not found');
        navigate('/user/shop');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (shouldRedirect = false) => {
    if (!product) return;

    const savedCart = localStorage.getItem('shopCart');
    let items = savedCart ? JSON.parse(savedCart) : [];

    // Map product data to cart item structure
    // Ensure all required fields for order processing are present
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      // For images, we need to handle potential legacy formats or different field names
      // The API returns 'images' array, but cart might expect 'image' string
      image: product.images?.[0] || product.image,
      images: product.images,
      quantity: quantity
    };

    const existingIndex = items.findIndex(item => item.id === product._id);

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push(cartItem);
    }

    localStorage.setItem('shopCart', JSON.stringify(items));
    window.dispatchEvent(new Event('shopCartUpdated')); // Notify other components
    updateCartCount();

    toast.success(`${quantity} ${product.name} added to cart`, {
      icon: '🛒',
    });

    if (shouldRedirect) {
      navigate('/user/shop/cart');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LogoLoader /></div>;
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
            <FiShare2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/user/shop/cart')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white relative active:scale-95 transition-transform"
          >
            <FiShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-transparent">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[50vh] bg-gray-100">
        <AnimatePresence mode='wait'>
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[activeImage]}
            className="w-full h-full object-cover"
            alt={product.name}
          />
        </AnimatePresence>

        {/* Thumbnails indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 p-4">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm ${idx === activeImage ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Container - Rounded overlap */}
      <div className="relative -mt-6 bg-white rounded-t-[30px] px-6 pt-8 min-h-[50vh]">
        {/* Horizontal Scroll for thumbnails if many */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-blue-500 scale-105' : 'border-transparent opacity-70'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-lg">
              <FiStar className="fill-yellow-500 text-yellow-500 w-3.5 h-3.5" />
              <span className="text-xs font-bold text-yellow-700">{product.rating || '4.5'}</span>
            </div>
            <span className="text-gray-400 text-xs">({product.reviewsCount || 128} reviews)</span>
          </div>
          {discount > 0 && (
            <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {discount}% OFF
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

        <div className="flex items-end gap-3 mb-6">
          <span className="text-3xl font-black text-blue-600">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through mb-1.5">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="h-px bg-gray-100 w-full mb-6"></div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">Description</h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
              {product.description || 'No description available for this product. High quality and verified by HomeBuddy standards.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <FiTruck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">Free Delivery</p>
                <p className="text-gray-500 text-[10px]">Orders over ₹500</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">1 Year Warranty</p>
                <p className="text-gray-500 text-[10px]">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 md:px-8 z-40 safe-area-pb">
        <div className="max-w-lg mx-auto flex gap-4 items-center">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 h-[54px]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${quantity > 1 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-300'}`}
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 active:scale-95 transition-transform"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleAddToCart(true)}
            className="flex-1 bg-blue-600 text-white font-bold h-[54px] rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <FiShoppingCart className="w-5 h-5" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
