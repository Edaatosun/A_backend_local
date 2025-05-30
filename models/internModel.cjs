const mongoose = require("mongoose");
const { Schema } = mongoose;

const internSchema = new Schema({
  internTitle: {
    type: String,
  },
  description: String,
  company: String,
  location: String,
  fromDate: String,
  toDate: String,
  internField: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const Intern = mongoose.model("Intern", internSchema);

module.exports = Intern;
