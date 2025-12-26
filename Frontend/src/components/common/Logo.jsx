import React, { forwardRef } from 'react';

/**
 * Centralized Logo Component
 * Usage: <Logo className="h-8 w-auto" />
 * Supports ref for animations
 */
const Logo = forwardRef(({ className = "h-8 w-auto", ...props }, ref) => {
  return (
    <img
      ref={ref}
      src="/Homebuddy24.png"
      alt="HomeBuddy24"
      className={`${className} object-contain`}
      {...props}
    />
  );
});

Logo.displayName = 'Logo';

export default Logo;
