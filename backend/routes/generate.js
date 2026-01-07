const express = require('express');
const { protect } = require('../middleware/auth');
const { generateImage } = require('../controllers/generateController');

const router = express.Router();

// @route   POST /api/generate
// @desc    Generate image from prompt (protected)
// @access  Private
router.post('/', protect, generateImage);

module.exports = router;


