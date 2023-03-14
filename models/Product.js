const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Seller Id is required"]
  },
  amount: {
    type: String,
    required: [true, "Amount is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Clothing", "Furniture", "Electronics", "Books", "Sports", "Others"]
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;