const axios = require("axios");
const User = require('../models/User');
const { createTokens } = require("../utils/jwt");
const { handleError, sendError } = require("../utils/helper");

module.exports.googleAuth = async (req, res) => {
  const { accessToken } = req.body;

  axios.get("https://www.googleapis.com/userinfo/v2/me",
    { headers: { "Authorization": "Bearer " + accessToken } })
    .then(async res => {
      const { name, email, picture, id } = res.data
      // store in db
      try {
        const user = await User.findOne({ email });
        if (user) {
          delete user._doc.__v;

          const accessToken = createTokens(user);
          return res.json({
            success: true,
            user: { ...user, accessToken },
            message: "Login Successful"
          });
        }
        const newUser = await User.create({ name, email, picture, googleId: id });
        const accessToken = createTokens(newUser);

        delete newUser._doc.__v;

        return res.status(201).json({
          success: true,
          user: { ...newUser, accessToken },
          message: "Registration Successful"
        });
      } catch (err) {
        let errors = handleError(err);
        return sendError(res, errors);
      }
    })
    .catch(error => {
      sendError(res, error.message)
    })
}