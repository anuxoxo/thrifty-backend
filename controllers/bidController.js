const Bid = require('../models/Bid');
const User = require('../models/User');
const { sendError } = require("../utils/helper");

module.exports.createBid = async (req, res) => {
  const { sellerId, buyerId, productId, bidAmount } = req.body;

  if (!sellerId || !buyerId || !productId || !bidAmount) return sendError(res, "Missing parameters")

  try {
    // 0. Check existing request
    const request = await Bid.findOne({ sellerId, buyerId, productId, bidAmount });

    // 2. Update Sender sentRequestIds  
    const u = await User.findById(buyerId);
    if (!u) return sendError(res, "Some error occurred!");

    const sentRequestIds = u.sentRequestIds.map(r => r.to.toString())
    if (!sentRequestIds.includes(receiver.toString())) {
      const user = await User.findByIdAndUpdate(sender, {
        $push: { sentRequestIds: { to: receiver, wanted: sender_wanted_contact } }
      })
      if (!user) return sendError(res, "Some error occurred!")
    }

    if (request) return res.json({
      success: true,
      message: "Request Pending",
      data: {
        sender: request.sender,
        receiver: request.receiver,
        sender_wanted_contact: request.sender_wanted_contact,
        type: request.type,
      }
    })

    // 1. Create a new request
    const newBid = await Bid.create({
      sellerId,
      buyerId,
      productId,
      bidAmount,
      status: "pending"
    })
    if (!newBid) return sendError(res, "Some error occurred!")

    return res.json({
      success: true,
      message: "Bid Request sent",
      data: {
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

module.exports.viewBidRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const requests = await Bid.find({ sellerId: id, statys: "pending" });
    if (!requests) return sendError(res, "Some error occurred!")

    // const resolvedRequests = await resolveRequests(requests)

    res.json({
      success: true,
      messages: "All Bid Requests Fetched",
      requests
    })
  }
  catch (err) {
    return sendError(res, err.message)
  }
}