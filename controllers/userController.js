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

  try {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return sendError(res, "Invalid User!")

    User.findOneAndUpdate({ email: req.body.email },
      { $set: { ...req.body } },
      { new: true },
      async (err, newUser) => {
        if (!err) {
          delete newUser._doc.password;
          delete newUser._doc.__v;

          return res.json({
            success: true,
            message: "Personal Information updated successfully!",
            user: newUser
          });

        } else {
          return sendError(res, err.message)
        }
      })
  } catch (err) {
    return sendError(res, err.message)
  }
}