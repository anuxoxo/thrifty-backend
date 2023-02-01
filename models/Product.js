const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  sellerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Seller Id is required"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  category: {
    type: String,
    requires: [true, "Category is required"]
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;