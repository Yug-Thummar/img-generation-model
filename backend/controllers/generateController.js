const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const User = require('../models/User');


exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'A valid prompt of at least 3 characters is required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.isSubscriptionActive()) {
      return res.status(403).json({ success: false, message: 'Subscription inactive' });
    }

    const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";
    const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt.trim() }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Hugging Face API Error ${response.status}: ${err}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'nano-banana/generated',
            format: 'png'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

    const uploadResult = await uploadToCloudinary();

    if (!uploadResult?.secure_url) {
      return res.status(502).json({
        success: false,
        message: 'Failed to upload image to Cloudinary'
      });
    }

    const saved = await Image.create({
      userId: req.user._id,
      cloudinaryUrl: uploadResult.secure_url,
      promptText: prompt.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Image generated successfully',
      data: {
        id: saved._id,
        imageUrl: saved.cloudinaryUrl,
        prompt: saved.promptText
      }
    });

  } catch (error) {
    console.error('Generate image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};