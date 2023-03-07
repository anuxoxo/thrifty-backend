const mongoose = require('mongoose');
const { Schema } = mongoose;

const bidSchema = new Schema({
  sellerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true
  },
  buyerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    defaultValue: "pending",
    required: true,
  }
});

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;