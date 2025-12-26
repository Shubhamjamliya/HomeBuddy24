import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'warning', // warning, danger, info
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
    },
    danger: {
      iconColor: '#EF4444',
      iconBg: '#FEE2E2',
    },
    info: {
      iconColor: themeColors.button,
      iconBg: `${themeColors.button}25`,
    },
  };

  const config = typeConfig[type] || typeConfig.warning;

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: config.iconBg,
          }}
        >
          <FiAlertCircle className="w-8 h-8" style={{ color: config.iconColor }} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
            style={{
              background: type === 'danger' ? '#EF4444' : themeColors.button,
              boxShadow: `0 4px 12px ${hexToRgba(type === 'danger' ? '#EF4444' : themeColors.button, 0.4)}`,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

