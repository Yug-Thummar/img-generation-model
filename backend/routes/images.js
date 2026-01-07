const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserImages } = require('../controllers/imageController');

// @route   GET /api/images
// @desc    Get all images for authenticated user
// @access  Private
router.get('/', protect, getUserImages);

module.exports = router;




