const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  forgotPassword
} = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

module.exports = router;



