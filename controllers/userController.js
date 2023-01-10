const User = require('../models/User');
const { sendError } = require("../utils/helper");

module.exports.getUserDetails = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) sendError(res, "User doesn't exist")
  else {
    delete user._doc.password
    delete user._doc.__v

    res.json({
      success: true,
      message: "User found successfully.",
      user
    })
  }
}

module.exports.updateUserDetails = async (req, res) => {
  // TODO: Vansh
}