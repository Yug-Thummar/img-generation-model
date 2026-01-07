const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  cloudinaryUrl: {
    type: String,
    required: [true, 'Cloudinary URL is required']
  },
  promptText: {
    type: String,
    required: [true, 'Prompt text is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries by userId
imageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);



