const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,  // Aynı isimli oda olmasın
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
