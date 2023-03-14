const Order = require('../models/Order');
const { sendError } = require("../utils/helper");

module.exports.getOrderDetails = async (req, res) => {
  const { sellerId, buyerId } = req.body;
  if (!sellerId || !buyerId) return sendError("Missing Parameters");

  try {
    const orders = await Order.find({ $or: [{ sellerId }, { buyerId }] });

    if (!orders) {
      sendError(res, "Orders doesn't exist")
    }
    else {
      return res.json({
        success: true,
        message: "Orders found successfully.",
        orders
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}