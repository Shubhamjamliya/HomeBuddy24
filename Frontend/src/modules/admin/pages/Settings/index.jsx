import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUserCheck, FiRefreshCw, FiGrid, FiDollarSign, FiSave } from 'react-icons/fi';
import { getSettings, updateSettings } from '../../services/settingsService';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    workerAutoAssignment: true, // Default to automatic
  });

  const [financialSettings, setFinancialSettings] = useState({
    visitedCharges: 0,
    gstPercentage: 18
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const adminSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
        if (Object.keys(adminSettings).length > 0) {
          setSettings(prev => ({ ...prev, ...adminSettings }));
        }
      } catch (error) {
        console.error('Error loading admin settings:', error);
      }
    };

    const loadFinancialSettings = async () => {
      try {
        const res = await getSettings();
        if (res.success && res.settings) {
          setFinancialSettings({
            visitedCharges: res.settings.visitedCharges,
            gstPercentage: res.settings.gstPercentage
          });
        }
      } catch (error) {
        console.error('Error loading financial settings:', error);
        // toast.error('Failed to load financial settings');
      }
    };

    loadSettings();
    loadFinancialSettings();
  }, []);

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem('adminSettings', JSON.stringify(updated));
    window.dispatchEvent(new Event('adminSettingsUpdated'));
  };

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    setFinancialSettings(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleFinancialSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(financialSettings);
      toast.success('Financial settings updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update financial settings');
    } finally {
      setLoading(false);
    }
  };

  // Load service mode
  const [serviceMode, setServiceMode] = useState('multi');
  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('adminServiceConfig') || '{}');
    setServiceMode(config.mode || 'multi');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage system settings</p>
      </div>

      {/* Financial Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <FiDollarSign className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Financial Configuration</h2>
        </div>

        <form onSubmit={handleFinancialSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visit Charges (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="visitedCharges"
                  value={financialSettings.visitedCharges}
                  onChange={handleFinancialChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Standard charge for worker visits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST / Tax (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="gstPercentage"
                  value={financialSettings.gstPercentage}
                  onChange={handleFinancialChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="18"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Applicable tax percentage on services</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-sm shadow-primary-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Worker Assignment Settings */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FiSettings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Worker Assignment Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {settings.workerAutoAssignment ? (
                <FiRefreshCw className="w-6 h-6 text-green-600" />
              ) : (
                <FiUserCheck className="w-6 h-6 text-blue-600" />
              )}
              <div>
                <p className="font-semibold text-gray-800">Assignment Mode</p>
                <p className="text-sm text-gray-600">
                  {settings.workerAutoAssignment
                    ? 'Automatic: System will auto-assign next worker when one rejects'
                    : 'Manual: Vendor must manually assign new worker when one rejects'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('workerAutoAssignment')}
              className={`w-14 h-7 rounded-full transition-all ${settings.workerAutoAssignment ? 'bg-green-500' : 'bg-gray-300'
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-all ${settings.workerAutoAssignment ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                style={{
                  marginTop: '2px',
                }}
              />
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Current Mode:</strong>{' '}
              {settings.workerAutoAssignment ? (
                <>
                  <span className="font-semibold">Automatic Assignment</span>
                  <br />
                  When a worker rejects a job, the system will automatically assign it to the next available worker.
                </>
              ) : (
                <>
                  <span className="font-semibold">Manual Assignment</span>
                  <br />
                  When a worker rejects a job, vendors will need to manually assign a new worker from the booking details page.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Service Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FiGrid className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Service Configuration</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Current Mode</p>
            <p className="text-sm text-gray-600">
              {serviceMode === 'single'
                ? 'Single Service Mode: Only one service category is allowed'
                : 'Multi Service Mode: Multiple service categories are allowed'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              To change service mode, go to <strong>Service Categories</strong> page.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AdminSettings;

