const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = new Schema({
  jobTitle: {
    type: String,
  },
  description: String,
  company: String,
  location: String,
  fromDate: String,
  toDate: String,
  jobField: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
