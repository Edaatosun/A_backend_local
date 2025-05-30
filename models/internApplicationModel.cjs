const mongoose = require("mongoose");
const { Schema } = mongoose;

const internApplicationModel = new Schema({
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: String, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InternApplication = mongoose.model("InternApplication", internApplicationModel);

module.exports = InternApplication;
