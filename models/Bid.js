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
  }
});

const User = mongoose.model('User', bidSchema);
module.exports = User;