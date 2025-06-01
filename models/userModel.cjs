const mongoose = require("mongoose");
const logoPath = "https://firebasestorage.googleapis.com/v0/b/arelnetworkstorage.firebasestorage.app/o/uploads%2Favatars%2Farel_logo.png?alt=media&token=83e0f42a-4a04-41bd-b189-dc48da6ed237"

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
