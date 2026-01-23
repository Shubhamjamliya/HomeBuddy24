import React, { memo } from 'react';
import { FiCheckCircle, FiLoader, FiMapPin, FiXCircle, FiClock, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BookingCard = memo(({ booking, onClick, variants }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500 text-white border-emerald-600 ring-emerald-500';
      case 'in_progress':
      case 'in-progress':
      case 'journey_started':
      case 'visited':
        return 'bg-blue-500 text-white border-blue-600 ring-blue-500';
      case 'completed':
        return 'bg-violet-500 text-white border-violet-600 ring-violet-500';
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-500 text-white border-rose-600 ring-rose-500';
      case 'awaiting_payment':
      default:
        return 'bg-amber-500 text-white border-amber-600 ring-amber-500';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    switch (status) {
      case 'in_progress':
      case 'in-progress':
        return 'In Progress';
      case 'journey_started': return 'On The Way';
      case 'visited': return 'Arrived';
      case 'awaiting_payment': return 'Request Accepted';
      case 'work_done': return 'Work Completed';
      default: return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  const getAddressString = (address) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city
      ].filter(Boolean);
      return parts.join(', ');
    }
    return 'Detailed Address';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      variants={variants}
      onClick={() => onClick(booking)}
      className="group relative bg-white rounded-[24px] p-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border border-gray-100 active:scale-[0.98] cursor-pointer overflow-hidden"
    >
      {/* Visual Status Indicator Strip */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${booking.status === 'confirmed' ? 'bg-emerald-500' :
        booking.status === 'completed' ? 'bg-violet-500' :
          booking.status === 'cancelled' ? 'bg-rose-500' :
            'bg-blue-500'
        }`} />

      <div className="pl-3">
        {/* Top Row: Service Info & Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            {/* Service Icon/Image Placeholder */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${booking.status === 'completed' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
              }`}>
              {booking.serviceImage ? (
                <img src={booking.serviceImage} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                (booking.serviceName || 'S').charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                {booking.serviceName || 'Service Request'}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                #{booking.bookingNumber || (booking._id || '').substring(0, 6)}
              </p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 mb-4" />

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-full bg-gray-50 text-gray-400">
              <FiCalendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Date & Time</p>
              <p className="text-sm font-bold text-gray-700">
                {formatDate(booking.scheduledDate)}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {booking.scheduledTime || booking.timeSlot?.start || 'Pending'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-full bg-gray-50 text-gray-400">
              <FiMapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Location</p>
              <p className="text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed">
                {getAddressString(booking.address)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Price & Action */}
        <div className="flex justify-between items-center mt-3 pt-2">
          <div>
            <span className="text-xs font-medium text-gray-400">Total Amount</span>
            <p className="text-lg font-black text-gray-900">
              ₹{(booking.finalAmount || booking.totalAmount || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default BookingCard;
