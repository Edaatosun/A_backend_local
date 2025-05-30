const mongoose = require("mongoose");
const logoPath = "http://localhost:3000/uploads/avatars/arel_logo.png"

const { Schema } = mongoose;

const userSchema = new Schema({
  tc: Number,
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    required: true,
  },
  schoolNumber: Number,
  eMail: {
    type: String,
    minlength: 5,
    maxlength: 100,
    trim: true,
    required: true,
  },
  photo: {
    type: String,
    default: logoPath
  },
  resume: {
    type: String,
    default:""
  },
  phoneNumber: Number,
  password: {
    type: String,
    minlength: 5,
    maxlength: 10,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    minlength: 5,
    maxlength: 10,
    trim: true,
    required: true,
  },
  department: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  classNo: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
