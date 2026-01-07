const Image = require('../models/Image');

// @desc    Get all images for authenticated user
// @route   GET /api/images
// @access  Private
exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('cloudinaryUrl promptText createdAt _id');

    res.status(200).json({
      success: true,
      message: 'Images fetched successfully',
      data: images
    });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




