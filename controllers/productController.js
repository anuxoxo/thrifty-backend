const Product = require('../models/Product');
const { sendError } = require("../utils/helper");

module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products) {
      sendError(res, "Product doesn't exist")
    }
    else {
      return res.json({
        success: true,
        message: "Products found successfully.",
        products
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    if (!sellerId)
      return sendError(res, "Parameters missing")

    const products = await Product.find({ sellerId })
    if (!products) {
      sendError(res, "Product doesn't exist")
    }
    else {
      res.json({
        success: true,
        message: "Products found successfully.",
        products
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    if (!category)
      return sendError(res, "Parameters missing")

    const products = await Product.find({ category })
    if (!products) {
      sendError(res, "Product doesn't exist")
    }
    else {
      res.json({
        success: true,
        message: "Products found successfully.",
        products
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id)
      return sendError(res, "Parameters missing")

    const product = await Product.findById(id)
    if (!product) {
      sendError(res, "Product doesn't exist")
    }
    else {
      res.json({
        success: true,
        message: "Product found successfully.",
        product
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.search = async (req, res) => {
  const { searchText } = req.body;

  if (!searchText) return res.json({ success: true, message: "No Products Found", products: [] })

  const products = await Product.find({
    $or: [
      { name: new RegExp(searchText, 'i') },
      { category: new RegExp(searchText, 'i') },
    ]
  })

  if (!products) return sendError(res, "Some error occurred!")

  return res.json({
    success: true,
    message: "Matches found",
    products
  })
}

module.exports.createProduct = async (req, res) => {
  try {
    const { sellerId, amount, name, location, category, images } = req.body;

    if (!sellerId || !amount || !name || !category || !location || !images)
      return sendError(res, "Parameters missing")

    const newProduct = await Product.create({ sellerId, amount, name, category, location, images });
    if (!newProduct) return sendError(res, "Couldn't create Product!")

    return res.json({
      success: true,
      message: "Product created.",
      product: newProduct
    })

  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.updateProduct = async (req, res) => {
  try {
    const { id, data } = req.body;

    if (!id || !data)
      return sendError(res, "Parameters missing")

    const updatedProduct = await Product.findByIdAndUpdate(id,
      { $set: { ...data } },
      { new: true });

    if (!updatedProduct) {
      return sendError(res, "Couldn't update Product!")
    } else {
      return res.json({
        success: true,
        message: "Product updated",
        product: updatedProduct
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return sendError(res, "Parameters missing")

    const tempProduct = await Product.findByIdAndDelete(id);
    console.log(tempProduct)

    if (!tempProduct) {
      return sendError(res, "Couldn't delete product!")
    } else {
      return res.json({
        success: true,
        message: "Product Deleted Successfully"
      })
    }
  } catch (err) {
    return sendError(res, err.message)
  }
}