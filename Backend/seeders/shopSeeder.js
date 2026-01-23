const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShopCategory = require('../models/ShopCategory');
const ShopProduct = require('../models/ShopProduct');

dotenv.config({ path: 'Backend/.env' });

const categories = [
  { name: 'Appliances', icon: '📺', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=100' },
  { name: 'Cleaning', icon: '🧹', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=100' },
  { name: 'Security', icon: '🔒', image: 'https://images.unsplash.com/photo-1558002038-103590318282?auto=format&fit=crop&q=80&w=100' },
  { name: 'Smart Home', icon: '🏠', image: 'https://images.unsplash.com/photo-1550524514-966953390111?auto=format&fit=crop&q=80&w=100' },
  { name: 'Electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1526733169359-ab1142275022?auto=format&fit=crop&q=80&w=100' },
];

const products = [
  {
    name: 'Mi Smart Air Purifier 4',
    categoryName: 'Appliances',
    price: 14999,
    originalPrice: 19999,
    rating: 4.8,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1585771724684-252702224483?auto=format&fit=crop&q=80&w=400',
    tag: 'Best Seller',
    description: 'Breathe clean, breathe healthy with Xiaomi Smart Air Purifier 4 that offers 99.97% filtration and smart app control.'
  },
  {
    name: 'Dyson V12 Detect Slim',
    categoryName: 'Cleaning',
    price: 45900,
    originalPrice: 52900,
    rating: 4.9,
    reviewsCount: 850,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400',
    tag: 'Premium',
    description: 'The most powerful lightweight cordless vacuum. Laser reveals microscopic dust.'
  },
  {
    name: 'Ring Video Doorbell',
    categoryName: 'Security',
    price: 8999,
    originalPrice: 12999,
    rating: 4.7,
    reviewsCount: 3200,
    image: 'https://images.unsplash.com/photo-1558002038-103590318282?auto=format&fit=crop&q=80&w=400',
    tag: 'Top Rated',
    description: 'See, hear and speak to anyone at your door from your phone, tablet or PC.'
  },
  {
    name: 'Philips Hue Smart Bulb',
    categoryName: 'Smart Home',
    price: 2499,
    originalPrice: 3500,
    rating: 4.6,
    reviewsCount: 5400,
    image: 'https://images.unsplash.com/photo-1550524514-966953390111?auto=format&fit=crop&q=80&w=400',
    tag: 'Popular',
    description: 'Personalize your lighting with over 16 million colors and dimmable white light.'
  },
  {
    name: 'Samsung 9kg Washer',
    categoryName: 'Appliances',
    price: 36990,
    originalPrice: 42000,
    rating: 4.5,
    reviewsCount: 1100,
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e04?auto=format&fit=crop&q=80&w=400',
    tag: 'New',
    description: 'Efficient fabric care with AI Control and EcoBubble technology.'
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear existing data
    await ShopCategory.deleteMany({});
    await ShopProduct.deleteMany({});
    console.log('Cleared existing shop data');

    // Insert Categories
    const createdCategories = await ShopCategory.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Prepare Products with Category IDs
    const productDocs = products.map(p => {
      const { categoryName, ...rest } = p;
      return {
        ...rest,
        category: categoryMap[categoryName],
        images: [p.image] // Ensure images array is populated for frontend
      };
    });

    // Insert Products
    await ShopProduct.insertMany(productDocs);
    console.log(`Created ${productDocs.length} products`);

    console.log('Shop seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
