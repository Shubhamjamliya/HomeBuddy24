/**
 * Centralized Theme Colors Configuration
 * Separate themes for User and Vendor modules
 * Update colors here to change theme across entire app
 * 
 * Usage:
 * - User module: import { userTheme } from '../../../../theme'
 * - Vendor module: import { vendorTheme } from '../../../../theme'
 * - Worker module: import { workerTheme } from '../../../../theme'
 */

// Homster LOGO Core Brand Colors - Updated to Professional Blue
const brand = {
  teal: '#2563EB', // Changed to Professional Blue (keeping key 'teal' to avoid breaking imports)
  blue: '#2563EB',
  yellow: '#D68F35',
  orange: '#BB5F36',
  gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  conic: 'conic-gradient(from 0deg, #2563EB, #1D4ED8, #2563EB)'
};

// User Theme Colors
const userTheme = {
  backgroundGradient: 'linear-gradient(180deg, #F0FDFA 0%, #F5FAFF 15%, #FFFFFF 30%)',
  gradient: brand.gradient,
  headerGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  headerBg: '#EFF6FF',
  button: brand.blue,
  icon: brand.blue,
  cardShadow: '0 8px 16px -2px rgba(37, 99, 235, 0.15), 0 4px 8px -1px rgba(37, 99, 235, 0.1)',
  cardBorder: '1px solid rgba(37, 99, 235, 0.15)',
  brand: brand,
  bottomNav: {
    home: { color: brand.blue, bg: brand.blue },
    bookings: { color: brand.blue, bg: brand.blue },
    shop: { color: brand.blue, bg: brand.blue },
    cart: { color: brand.blue, bg: brand.blue },
    account: { color: brand.blue, bg: brand.blue }
  },
  primaryButton: brand.blue,
  secondaryButton: '#FFFFFF'
};

// Vendor Theme Colors
const vendorTheme = {
  backgroundGradient: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.03) 0%, rgba(187, 95, 54, 0.02) 10%, #ffffff 20%)',
  gradient: brand.gradient,
  headerGradient: brand.blue,
  button: brand.blue,
  icon: brand.blue,
  brand: brand
};

// Worker Theme Colors
const workerTheme = {
  backgroundGradient: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.03) 0%, rgba(187, 95, 54, 0.02) 10%, #ffffff 20%)',
  gradient: brand.gradient,
  headerGradient: brand.blue,
  button: brand.blue,
  icon: brand.blue,
  brand: brand
};

// Default theme (for backward compatibility)
const themeColors = userTheme;

// Export all themes
export { userTheme, vendorTheme, workerTheme, brand };
export default themeColors;


