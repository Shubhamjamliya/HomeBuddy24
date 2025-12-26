import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiX, FiMapPin, FiClock, FiDollarSign, FiUser, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { vendorTheme as themeColors } from '../../../../theme';

import { acceptBooking, rejectBooking } from '../../services/bookingService';
import { playAlertRing } from '../../../../utils/notificationSound';

const BookingAlert = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [isClosing, setIsClosing] = useState(false);
  const [booking, setBooking] = useState(null);
  const audioRef = useRef(null);
  const alarmIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Load booking data from localStorage
  useEffect(() => {


    const loadBooking = () => {
      try {
        // First try to find in pending jobs
        const pendingJobs = JSON.parse(localStorage.getItem('vendorPendingJobs') || '[]');
        let foundBooking = pendingJobs.find(job => job.id === id);

        // If not found in pending, try accepted bookings
        if (!foundBooking) {
          const acceptedBookings = JSON.parse(localStorage.getItem('vendorAcceptedBookings') || '[]');
          foundBooking = acceptedBookings.find(job => job.id === id);
        }

        // If still not found, use default
        if (!foundBooking) {
          foundBooking = {
            id: id || 'pending-1',
            serviceType: 'Fan Repairing',
            user: {
              name: 'John Doe',
              phone: '+91 9876543210',
            },
            location: {
              address: '123 Main Street, Indore',
              distance: '2.5 km',
            },
            price: 500,
            timeSlot: {
              date: 'Today',
              time: '2:00 PM - 4:00 PM',
            },
          };
        }

        setBooking(foundBooking);
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };

    loadBooking();
    setTimeout(loadBooking, 100);
  }, [id]);

  // Play alarm sound
  useEffect(() => {
    // Stop alarm if closing
    if (isClosing) {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore errors when closing
        }
        audioContextRef.current = null;
      }
      return;
    }

    // Create audio context for alarm sound
    const playAlarm = () => {
      try {
        // Play initial ring
        playAlertRing();

        // Repeat alarm every 1.5 seconds for higher urgency
        const interval = setInterval(() => {
          if (timeLeft > 0 && !isClosing) {
            playAlertRing();
          } else {
            clearInterval(interval);
            alarmIntervalRef.current = null;
          }
        }, 1500);

        alarmIntervalRef.current = interval;

        return () => {
          clearInterval(interval);
          alarmIntervalRef.current = null;
        };
      } catch (error) {
        console.error('Error playing alarm:', error);
      }
    };

    playAlarm();

    // Cleanup on unmount or when closing
    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore errors
        }
        audioContextRef.current = null;
      }
    };
  }, [timeLeft, isClosing]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isClosing) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isClosing) {
      // Auto-reject after timeout
      handleReject();
    }
  }, [timeLeft, isClosing]);

  const handleAccept = async () => {
    if (!booking || isClosing) return;

    // Stop alarm immediately
    setIsClosing(true);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore errors
      }
      audioContextRef.current = null;
    }
    try {
      // Call API to accept booking
      await acceptBooking(booking.id);

      // Remove from pending jobs locally
      const pendingJobs = JSON.parse(localStorage.getItem('vendorPendingJobs') || '[]');
      const updatedPending = pendingJobs.filter(job => job.id !== booking.id);
      localStorage.setItem('vendorPendingJobs', JSON.stringify(updatedPending));

      // Update stats locally
      const vendorStats = JSON.parse(localStorage.getItem('vendorStats') || '{}');
      vendorStats.activeJobs = (vendorStats.activeJobs || 0) + 1;
      vendorStats.pendingAlerts = Math.max(0, (vendorStats.pendingAlerts || 0) - 1);
      localStorage.setItem('vendorStats', JSON.stringify(vendorStats));

      // Dispatch events
      window.dispatchEvent(new Event('vendorJobsUpdated'));
      window.dispatchEvent(new Event('vendorStatsUpdated'));

      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 300);
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking. It may have been cancelled or assigned to someone else.');
    }
  };

  const handleReject = async () => {
    if (!booking || isClosing) return;

    // Stop alarm immediately
    setIsClosing(true);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore errors
      }
      audioContextRef.current = null;
    }
    try {
      // Call API to reject booking
      await rejectBooking(booking.id, 'Vendor rejected');

      // Remove from pending locally
      const pendingJobs = JSON.parse(localStorage.getItem('vendorPendingJobs') || '[]');
      const updated = pendingJobs.filter(job => job.id !== booking.id);
      localStorage.setItem('vendorPendingJobs', JSON.stringify(updated));

      // Update stats
      const vendorStats = JSON.parse(localStorage.getItem('vendorStats') || '{}');
      vendorStats.pendingAlerts = Math.max(0, (vendorStats.pendingAlerts || 0) - 1);
      localStorage.setItem('vendorStats', JSON.stringify(vendorStats));

      // Dispatch events
      window.dispatchEvent(new Event('vendorJobsUpdated'));
      window.dispatchEvent(new Event('vendorStatsUpdated'));

      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 300);
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleClose = () => {
    handleReject();
  };

  if (!booking) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <div className="bg-white/90 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  // Circular progress calculation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / 60) * circumference;
  const dashoffset = circumference - progress;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark Overlay with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-50 border border-white/20"
      >
        <FiX className="w-6 h-6 text-white" />
      </motion.button>

      {/* Main Alert Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600 to-purple-700" />

        {/* Content Container */}
        <div className="relative pt-8 px-6 pb-6">

          {/* Animated Countdown Timer */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              {/* SVG Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={timeLeft <= 10 ? '#EF4444' : '#6366F1'}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-600'}`}>
                {timeLeft}s
              </span>

              {/* Pulsing Effect for Urgency */}
              {timeLeft <= 10 && (
                <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
              )}
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">New Request!</h2>
            <p className="text-gray-500 font-medium">Earn ₹{booking.price}</p>
          </div>

          {/* Service Banner */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-2xl">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Service</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{booking.serviceType}</p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FiMapPin className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Location</p>
                <p className="font-semibold text-gray-900 leading-snug">{booking.location?.address}</p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">
                  {booking.location?.distance || '2.5 km'} away
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FiClock className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Time</p>
                <p className="font-semibold text-gray-900 leading-snug">{booking.timeSlot.date}</p>
                <p className="text-sm text-gray-500">{booking.timeSlot.time}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleReject}
              className="py-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
            >
              Ignore
            </button>
            <button
              onClick={handleAccept}
              className="py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Accept Now <FiArrowRight />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default BookingAlert;

