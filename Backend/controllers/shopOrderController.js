const ShopOrder = require('../models/ShopOrder');
const ShopProduct = require('../models/ShopProduct');

exports.createOrder = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Generate order number if not provided
    if (!req.body.orderNumber) {
      req.body.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // In a real app, you'd verify stock and recalculate total here
    const order = await ShopOrder.create(req.body);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('Create Order Error Details:', JSON.stringify(req.body, null, 2));
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await ShopOrder.find({ user: req.user.id }).sort('-createdAt').lean();
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await ShopOrder.findById(req.params.id).populate('items.product').lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Check if it belongs to user (or if user is admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin Controllers
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await ShopOrder.find().populate('user', 'name phone').sort('-createdAt').lean();
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await ShopOrder.findByIdAndUpdate(req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await ShopOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure the user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation if status is 'Pending'
    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.orderStatus}` });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, data: order, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel Order Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

