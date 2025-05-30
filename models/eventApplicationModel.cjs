const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventApplicationModel = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EventApplication = mongoose.model("EventApplication", eventApplicationModel);

module.exports = EventApplication;
