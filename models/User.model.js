const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    // unique: true -> Ideally, should be unique, but its up to you
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isCompany: {
    type: Boolean,
    default: false,
  },
  location: String,
  business: String,
  jobTitle: String,
});

const UserModel = model("UserColl", userSchema);

module.exports = UserModel;
