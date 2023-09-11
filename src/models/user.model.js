const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlenght: 12,
  },
  permissions: {
    type: Array,
    required: false,
    default: ["user"],
  },
  profileImg: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
