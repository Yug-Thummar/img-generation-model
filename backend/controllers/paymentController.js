const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    // Validate amount (1₹, 2₹, or 3₹ = 100, 200, or 300 paisa)
    const validAmounts = [100, 200, 300]; // Amounts in paisa
    if (!validAmounts.includes(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Only 1₹, 2₹, or 3₹ are allowed'
      });
    }

    // Create order options
    const options = {
      amount: amount, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        email: req.user.email
      }
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify Razorpay payment and update subscription
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Create signature for verification
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Fetch order details from Razorpay to get amount
    const order = await razorpay.orders.fetch(razorpay_order_id);

    // Calculate subscription expiry based on amount
    // 1₹ (100 paisa) = 30 days, 2₹ (200 paisa) = 60 days, 3₹ (300 paisa) = 90 days
    const amount = order.amount; // Amount in paisa
    let daysToAdd = 0;

    if (amount === 100) {
      daysToAdd = 30; // 1 month
    } else if (amount === 200) {
      daysToAdd = 60; // 2 months
    } else if (amount === 300) {
      daysToAdd = 90; // 3 months
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    // Calculate new expiry date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setDate(currentDate.getDate() + daysToAdd);

    // Update user subscription
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has an active subscription that extends beyond the new expiry
    let finalExpiryDate = expiryDate;
    if (user.subscriptionExpiry && user.subscriptionExpiry > currentDate) {
      // If existing subscription is still active, extend from current expiry date
      const existingExpiry = new Date(user.subscriptionExpiry);
      existingExpiry.setDate(existingExpiry.getDate() + daysToAdd);
      finalExpiryDate = existingExpiry;
    }

    // Update user subscription
    user.subscriptionStatus = 'active';
    user.subscriptionExpiry = finalExpiryDate;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription updated successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        daysAdded: daysToAdd
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


