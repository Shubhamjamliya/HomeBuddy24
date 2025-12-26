const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  login,
  logout
} = require('../../controllers/adminControllers/adminAuthController');
const { authenticate } = require('../../middleware/authMiddleware');
const { isAdmin } = require('../../middleware/roleMiddleware');

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/login', loginValidation, login);
router.post('/logout', authenticate, isAdmin, logout);

module.exports = router;

