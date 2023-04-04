const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
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
  orderStatus: {
    type: String,
    defaultValue: "Pending",
    required: true,
    enum: ["Delivered", "Pending", "Processing"]
  },
  paymentStatus: {
    type: String,
    defaultValue: "Pending",
    required: true,
    enum: ["Completed", "Pending", "Processing"]
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;