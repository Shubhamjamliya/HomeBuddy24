import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { themeColors } from '../../../../theme';
import { userAuthService } from '../../../../services/authService';

const Header = ({ location, onLocationClick }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: 'Customer',
    profilePhoto: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserProfile({
            name: userData.name || 'Customer',
            profilePhoto: userData.profilePhoto || ''
          });
        }

        const response = await userAuthService.getProfile();
        if (response.success && response.user) {
          setUserProfile({
            name: response.user.name || 'Customer',
            profilePhoto: response.user.profilePhoto || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = () => {
    if (userProfile.name && userProfile.name !== 'Customer') {
      const names = userProfile.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="px-5 pt-8 pb-3 bg-transparent relative z-[1000] w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full">
        {/* Left: Profile & Greeting */}
        <div className="flex items-center gap-4" onClick={() => navigate('/user/account')}>
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-[24px] overflow-hidden border-[3px] border-white shadow-lg transition-transform group-hover:scale-105 duration-300 active:scale-95">
              {userProfile.profilePhoto ? (
                <img
                  src={userProfile.profilePhoto}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: `linear-gradient(135deg, ${themeColors.brand.teal}, ${themeColors.brand.orange})` }}
                >
                  {getInitials()}
                </div>
              )}
            </div>
            {/* Status Dot */}
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm z-10"></div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-gray-500 text-sm font-semibold tracking-wide flex items-center gap-2 mb-0.5" style={{ fontFamily: 'sans-serif' }}>
              Hello, <span className="animate-wave text-xl origin-[70%_70%] inline-block">👋</span>
            </span>
            <h2 className="text-gray-900 font-black text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {userProfile.name.split(' ')[0]}
            </h2>
          </div>
        </div>

        {/* Right: Notification Bell */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/notifications')}
            className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center relative hover:shadow-md transition-all active:scale-95"
          >
            <FiBell className="w-5 h-5 text-gray-700" />
            <span
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: '#3B82F6' }}
            >
              2
            </span>
          </button>
        </div>
      </div>

      {/* Small Location indicator (kept since it was there and is useful) */}
      <div
        onClick={onLocationClick}
        className="mt-2 flex items-center gap-1 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 w-fit cursor-pointer hover:bg-white/80 transition-colors"
      >
        <span className="text-[10px] text-gray-500 font-medium">📍 {location || 'Select Location'}</span>
      </div>
    </header>
  );
};

export default Header;
