const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendError } = require("../utils/helper");

module.exports.getOrderDetails = async (req, res) => {
  const { id } = req.body;
  if (!id) return sendError(res, "Missing Parameters");

  try {
    const orders = await Order.find({ $or: [{ sellerId: id }, { buyerId: id }] });
    const resolvedRequests = await resolveRequests(orders)

    if (!orders) {
      sendError(res, "Orders doesn't exist")
    }
    else {
      return res.json({
        success: true,
        message: "Orders found successfully.",
        orders: resolvedRequests
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

function resolveRequests(requests) {
  return Promise.all(
    requests.map(request => {
      return resolveProducts(request)
    })
  );
}

async function resolveProducts(request) {
  const results = await Promise.all([
    Product.findById(request.productId, { amount: 1, name: 1, category: 1, amount: 1, images: 1 }),
    User.findById(request.sellerId, { email: 1, name: 1, picture: 1 }),
    User.findById(request.buyerId, { email: 1, name: 1, picture: 1 }),
  ])

  return {
    ...request._doc,
    product: { ...results[0]._doc },
    seller: { ...results[1]._doc },
    buyer: { ...results[2]._doc },
  };
}