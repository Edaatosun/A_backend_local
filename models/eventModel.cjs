const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  eventTitle: {
    type: String,
  },
  description: String,
  company: String,
  location: String,
  fromDate: String,
  toDate: String,
  eventField: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
