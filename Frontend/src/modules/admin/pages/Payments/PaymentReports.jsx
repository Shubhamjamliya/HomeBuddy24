import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiCalendar } from 'react-icons/fi';

const PaymentReports = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Reports</h2>
        <p className="text-gray-500 mb-6">Generate and download financial reports for transactions, settlements, and worker payments.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Report */}
          <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FiFileText className="w-6 h-6" />
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Revenue Report</h3>
            <p className="text-sm text-gray-500 mb-4">Detailed breakdown of income, commissions, and refunds.</p>
            <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
              <FiDownload className="mr-1" /> Download PDF
            </button>
          </div>

          {/* Vendor Settlement Report */}
          <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-500 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                <FiFileText className="w-6 h-6" />
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Settlement Report</h3>
            <p className="text-sm text-gray-500 mb-4">History of vendor settlements, dues collected, and payouts.</p>
            <button className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
              <FiDownload className="mr-1" /> Download CSV
            </button>
          </div>

          {/* Worker Payout Report */}
          <div className="border border-gray-200 rounded-lg p-5 hover:border-orange-500 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                <FiFileText className="w-6 h-6" />
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Worker Payouts</h3>
            <p className="text-sm text-gray-500 mb-4">Summary of worker earnings and platform payments.</p>
            <button className="text-gray-400 text-sm font-medium flex items-center cursor-not-allowed">
              <FiDownload className="mr-1" /> Download CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Report</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>Transaction History</option>
              <option>Vendor Balances</option>
              <option>Platform Fees</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
              <FiDownload className="mr-2" /> Generate Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentReports;