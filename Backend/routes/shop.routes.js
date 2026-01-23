const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/shopCategoryController');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/shopProductController');
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/shopOrderController');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// Public Routes
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// User Routes (Authenticated)
router.post('/orders', authenticate, createOrder);
router.get('/orders/my', authenticate, getMyOrders);
router.get('/orders/:id', authenticate, getOrderDetails);
router.put('/orders/:id/cancel', authenticate, cancelOrder);

// Admin Routes (Admin Only)
router.post('/categories', authenticate, isAdmin, createCategory);
router.put('/categories/:id', authenticate, isAdmin, updateCategory);
router.delete('/categories/:id', authenticate, isAdmin, deleteCategory);

router.post('/products', authenticate, isAdmin, createProduct);
router.put('/products/:id', authenticate, isAdmin, updateProduct);
router.delete('/products/:id', authenticate, isAdmin, deleteProduct);

router.get('/admin/orders', authenticate, isAdmin, getAllOrders);
router.put('/admin/orders/:id', authenticate, isAdmin, updateOrderStatus);

module.exports = router;
