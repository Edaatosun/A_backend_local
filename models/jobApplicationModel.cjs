const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobApplicationModel = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
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

const JobApplication = mongoose.model("JobApplication", jobApplicationModel);

module.exports = JobApplication;
