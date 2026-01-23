import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import { userAuthService } from '../../../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiEdit3,
  FiClipboard,
  FiHeadphones,
  FiFileText,
  FiStar,
  FiMapPin,
  FiCreditCard,
  FiSettings,
  FiChevronRight,
  FiBell,
  FiShoppingBag,
  FiLogOut,
  FiGift
} from 'react-icons/fi';
import { MdAccountBalanceWallet } from 'react-icons/md';

const Account = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: 'Verified Customer',
    phone: '',
    email: '',
    isPhoneVerified: false,
    isEmailVerified: false,
    walletBalance: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First check localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserProfile({
            name: userData.name || 'Verified Customer',
            phone: userData.phone || '',
            email: userData.email || '',
            isPhoneVerified: userData.isPhoneVerified || false,
            isEmailVerified: userData.isEmailVerified || false,
            profilePhoto: userData.profilePhoto || '',
            walletBalance: userData.wallet?.balance ?? 0
          });
        }

        // Fetch fresh data from API
        const response = await userAuthService.getProfile();
        if (response.success && response.user) {
          setUserProfile({
            name: response.user.name || 'Verified Customer',
            phone: response.user.phone || '',
            email: response.user.email || '',
            isPhoneVerified: response.user.isPhoneVerified || false,
            isEmailVerified: response.user.isEmailVerified || false,
            profilePhoto: response.user.profilePhoto || '',
            walletBalance: response.user.wallet?.balance ?? 0
          });
        }
      } catch (error) {
        // Use localStorage data if API fails
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserProfile({
            name: userData.name || 'Verified Customer',
            phone: userData.phone || '',
            email: userData.email || '',
            isPhoneVerified: userData.isPhoneVerified || false,
            isEmailVerified: userData.isEmailVerified || false
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    if (phone.startsWith('+91')) return phone;
    if (phone.length === 10) return `+91 ${phone}`;
    return phone;
  };

  // Get initials for avatar
  const getInitials = () => {
    if (userProfile.name && userProfile.name !== 'Verified Customer') {
      const names = userProfile.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (userProfile.phone) {
      return userProfile.phone.slice(-2);
    }
    return 'VC';
  };

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      toast.success('Logged out successfully');
      navigate('/user/login');
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      toast.success('Logged out successfully');
      navigate('/user/login');
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, color = "text-gray-900", badge }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'text-red-500' ? 'bg-red-50' : 'bg-gray-50 group-hover:bg-blue-50'} transition-colors`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className={`font-semibold ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
            {badge}
          </span>
        )}
        <FiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
      </div>
    </motion.button>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 relative bg-[#F8FAFC]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-[#F1F5F9]"
          style={{
            background: 'radial-gradient(at 0% 0%, #BAE6FD 0%, transparent 70%), radial-gradient(at 100% 0%, #FED7AA 0%, transparent 70%), #F1F5F9'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-white/20 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-800" />
            </motion.button>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/user/notifications')}
            className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm relative"
          >
            <FiBell className="w-5 h-5 text-gray-800" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </motion.button>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 pt-4 max-w-lg mx-auto"
        >
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[32px] p-6 shadow-xl shadow-blue-100/50 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-50 rounded-full -ml-8 -mb-8 blur-2xl opacity-50"></div>

            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg">
                  {userProfile.profilePhoto ? (
                    <img
                      src={userProfile.profilePhoto}
                      alt={userProfile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br from-blue-500 to-teal-400">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/user/update-profile')}
                  className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full border-2 border-white shadow-md active:scale-95 transition-transform"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate mb-1">
                  {userProfile.name}
                </h2>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {userProfile.phone ? formatPhoneNumber(userProfile.phone) : 'No phone connected'}
                </p>
                {userProfile.isPhoneVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 tracking-wide uppercase">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => navigate('/user/wallet')}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MdAccountBalanceWallet className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Balance</span>
              <p className={`text-lg font-black mt-0.5 ${userProfile.walletBalance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                ₹{Math.abs(userProfile.walletBalance || 0).toLocaleString('en-IN')}
                {userProfile.walletBalance < 0 && <span className="text-xs font-normal ml-1">(Penalty)</span>}
              </p>
            </button>
            <button
              onClick={() => navigate('/user/rewards')}
              className="bg-gray-900 p-4 rounded-3xl shadow-lg shadow-gray-200 hover:shadow-xl transition-all text-left relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-10 h-10 bg-white/10 text-yellow-400 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <FiGift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-white/60 font-bold uppercase tracking-wider">Rewards</span>
                  <p className="text-lg font-black text-white mt-0.5">Refer & Earn</p>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Menu Groups */}

          {/* Shopping */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">Shopping</h3>
            <MenuItem
              icon={FiShoppingBag}
              label="My Orders"
              onClick={() => navigate('/user/shop/orders')}
            />
            <MenuItem
              icon={FiFileText}
              label="My Plans"
              onClick={() => navigate('/user/my-plan')}
            />
          </motion.div>

          {/* Activity */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">Activity</h3>
            <MenuItem
              icon={FiClipboard}
              label="My Bookings"
              onClick={() => navigate('/user/my-bookings')}
            />
            <MenuItem
              icon={FiStar}
              label="My Ratings"
              onClick={() => navigate('/user/my-rating')}
            />
          </motion.div>

          {/* Preferences */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">Preferences</h3>
            <MenuItem
              icon={FiMapPin}
              label="Manage Addresses"
              onClick={() => navigate('/user/manage-addresses')}
            />
            <MenuItem
              icon={FiCreditCard}
              label="Payment Methods"
              onClick={() => navigate('/user/manage-payment-methods')}
            />
            <MenuItem
              icon={FiSettings}
              label="Settings"
              onClick={() => navigate('/user/settings')}
            />
          </motion.div>

          {/* Support & Legal */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">Support & More</h3>
            <MenuItem
              icon={FiHeadphones}
              label="Help & Support"
              onClick={() => navigate('/user/help-support')}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/user/about-homebuddy')}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group mb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-blue-50 transition-colors">
                  <span className="font-bold text-blue-600">H</span>
                </div>
                <span className="font-semibold text-gray-900">About HomeBuddy</span>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
            </motion.button>
            <div className="h-4"></div>
            <MenuItem
              icon={FiLogOut}
              label="Logout"
              color="text-red-500"
              onClick={handleLogout}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pb-8">
            <p className="text-xs font-medium text-gray-400">Version 7.6.27 R547</p>
          </motion.div>

        </motion.main>
      </div>
    </div>
  );
};

export default Account;
