import React from "react";

const CardShell = ({ icon: Icon, title, subtitle, children }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        {Icon ? (
          <div
            className="p-2.5 rounded-xl shadow-md flex items-center justify-center shrink-0"
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom right, #2874F0, #1e5fd4)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <Icon
              className="text-white"
              style={{
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                display: 'block',
                color: '#ffffff',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2'
              }}
            />
          </div>
        ) : null}
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{title}</div>
          {subtitle ? <div className="text-sm font-medium text-gray-600 mt-1.5">{subtitle}</div> : null}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default CardShell;
