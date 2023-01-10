const mongoose = require('mongoose');
const { isEmail } = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "User with given email already exists"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  googleId: {
    type: String,
    defaultValue: null
  },
  name: {
    type: String,
    defaultValue: null
  },
  picture: {
    type: String,
    defaultValue: null
  },
  interestedCategories: {
    type: [{ type: "String" }],
    defaultValue: []
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;