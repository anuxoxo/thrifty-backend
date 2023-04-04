const Bid = require('../models/Bid');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const { sendError } = require("../utils/helper");

module.exports.createBid = async (req, res) => {
  const { sellerId, buyerId, productId, bidAmount } = req.body;

  if (!sellerId || !buyerId || !productId || !bidAmount) return sendError(res, "Missing parameters")

  try {
    // 0. Check existing request
    const request = await Bid.findOne({ sellerId, buyerId, productId, bidAmount });

    // 2. Update Sender bids  
    const u = await User.findById(buyerId);
    if (!u) return sendError(res, "Some error occurred!");

    if (!u?.bids?.includes(productId?.toString())) {
      const user = await User.findByIdAndUpdate(buyerId, {
        $push: { bids: productId }
      })
      if (!user) return sendError(res, "Some error occurred!")
    }

    if (request) return res.json({
      success: true,
      message: "Request Pending",
      data: {
        _id: request._id,
        sellerId: request.sellerId,
        buyerId: request.buyerId,
        productId: request.productId,
        bidAmount: request.bidAmount
      }
    })

    // 1. Create a new request
    const newBid = await Bid.create({
      sellerId,
      buyerId,
      productId,
      bidAmount,
      status: "Pending"
    })

    if (!newBid) return sendError(res, "Some error occurred!")

    return res.json({
      success: true,
      message: "Bid Request sent",
      data: {
        _id: newBid._id,
        sellerId: newBid.sellerId,
        buyerId: newBid.buyerId,
        productId: newBid.productId,
        bidAmount: newBid.bidAmount,
        status: newBid.status,
      }
    })
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.viewSellerBidRequestsByProductId = async (req, res) => {
  const { id, productId } = req.params;

  try {
    const requests = await Bid.find({ sellerId: id, productId, status: "Pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    const resolvedRequests = await resolveRequests(requests)

    res.json({
      success: true,
      messages: "All Bid Requests Fetched",
      bids: resolvedRequests
    })
  }
  catch (err) {
    return sendError(res, err.message)
  }
}
module.exports.viewSellerBidRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const requests = await Bid.find({ sellerId: id, status: "Pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    const resolvedRequests = await resolveRequests(requests)

    res.json({
      success: true,
      messages: "All Bid Requests Fetched",
      bids: resolvedRequests
    })
  }
  catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.viewBuyerBidRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const requests = await Bid.find({ buyerId: id, status: "Pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    const resolvedRequests = await resolveRequests(requests)

    res.json({
      success: true,
      messages: "All Bid Requests Fetched",
      bids: resolvedRequests
    })
  }
  catch (err) {
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
    Product.findById(request.productId, { amount: 1, name: 1, category: 1 }),
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

module.exports.rejectBid = async (req, res) => {
  const { sellerId, buyerId, productId, bidAmount } = req.body;

  try {
    // 1. delete request document
    const tempRequest = await Bid.deleteOne({
      sellerId, buyerId, productId, bidAmount
    });
    if (!tempRequest.deletedCount) return sendError(res, "Some error occurred!");

    // 2. Remove product id from buyers' bids
    const buyerObj = await User.findByIdAndUpdate(buyerId, {
      $pull: { bids: productId }
    })
    if (!buyerObj) return sendError(res, "Some error occurred!")

    // 3. fetch recent requests 
    const requests = await Bid.find({ sellerId, status: "Pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    const resolvedRequests = await resolveRequests(requests);

    res.json({
      success: true,
      messages: "Request rejected",
      requests: resolvedRequests
    })

  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.acceptBid = async (req, res) => {
  const { sellerId, buyerId, productId, bidAmount } = req.body;

  if (!sellerId || !buyerId || !productId || !bidAmount)
    return sendError(res, "Parameters missing")

  try {
    // 1. update request doc to accepted
    const updatedrequest = await Bid.findOneAndUpdate(
      { sellerId, buyerId, productId, bidAmount },
      { status: "Accepted" });

    if (!updatedrequest) return sendError(res, "Some error occurred!");

    // 2. remove product id from buyer's bids
    const buyerObj = await User.findByIdAndUpdate(buyerId, {
      $pull: { bids: productId }
    })
    if (!buyerObj) return sendError(res, "Some error occurred!")

    // 3. Create new order
    const newOrder = await Order.create({ sellerId, buyerId, productId, bidAmount, orderStatus: "Processing", paymentStatus: "Pending" });
    if (!newOrder) return sendError(res, "Couldn't place order!")

    // 4. fetch recent requests 
    const requests = await Bid.find({ sellerId, productId, status: "Pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    const resolvedRequests = await resolveRequests(requests)

    res.json({
      success: true,
      messages: "Request Accepted",
      requests: resolvedRequests
    })

  } catch (err) {
    return sendError(res, err.message)
  }
}