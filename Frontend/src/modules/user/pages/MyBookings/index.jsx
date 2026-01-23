import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import NotificationBell from '../../components/common/NotificationBell';
import { motion } from 'framer-motion';
import { bookingService } from '../../../../services/bookingService';
import BookingCard from './components/BookingCard';
import SkeletonBookingCard from './components/SkeletonBookingCard';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, in-progress, completed, cancelled

  useEffect(() => {
    let isMounted = true;
    const loadBookings = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filter !== 'all') {
          params.status = filter;
        }
        const response = await bookingService.getUserBookings(params);
        if (isMounted) {
          if (response.success) {
            setBookings(response.data || []);
          } else {
            toast.error(response.message || 'Failed to load bookings');
            setBookings([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load bookings', error);
          // Silent catch to handle network aborts or minor issues without annoying toast on mount sometimes
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    // Listen for real-time updates
    const handleUpdate = () => loadBookings();
    window.addEventListener('userBookingsUpdated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('userBookingsUpdated', handleUpdate);
    };
  }, [filter]);

  const handleBookingClick = useCallback((booking) => {
    navigate(`/user/booking/${booking._id || booking.id}`);
  }, [navigate]);

  // Helper for background gradient from Home theme
  const backgroundStyle = {
    background: 'radial-gradient(at 0% 0%, #BAE6FD 0%, transparent 70%), radial-gradient(at 100% 0%, #FED7AA 0%, transparent 70%), #F1F5F9',
    minHeight: '100vh'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div style={backgroundStyle} className="pb-24">
      {/* Modern Glass Header */}
      <header className="sticky top-0 z-40 px-4 py-4 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
        </div>
        <div className="bg-white/50 rounded-full p-1">
          <NotificationBell />
        </div>
      </header>

      {/* Modern Floating Filter Tabs */}
      <div className="sticky top-[72px] z-30 py-2 overflow-x-auto no-scrollbar px-4 mb-2">
        <div className="flex gap-3 min-w-max">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'in-progress', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105'
                  : 'bg-white/80 text-gray-500 hover:bg-white shadow-sm'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      <main className="px-4 py-2 max-w-lg mx-auto w-full min-h-[60vh]">
        {loading ? (
          <div className="space-y-4">
            <SkeletonBookingCard />
            <SkeletonBookingCard />
            <SkeletonBookingCard />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 p-8 shadow-sm mx-2"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-100/50">
              <FiCalendar className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-gray-900 text-xl font-bold mb-2">No Bookings Found</h3>
            <p className="text-gray-500 text-sm max-w-[240px] leading-relaxed mb-6">
              {filter === 'all'
                ? "You haven't booked any services yet. Start your journey with HomeBuddy!"
                : `No ${filter} bookings found.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/user')}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-900/10 active:scale-95 transition-transform"
              >
                Book a Service
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onClick={handleBookingClick}
                variants={itemVariants}
              // Optional: pass style props or callbacks if needed
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;

