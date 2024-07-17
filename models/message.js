const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
    },
    sent: {
      type: Date,
      default: Date.now,
    },
    seen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
