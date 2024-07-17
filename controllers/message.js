// messageController.js
const Message = require("../models/message");

const mongoose = require("mongoose");

exports.getAllMessages = async (req, res) => {
  const { sender, receiver } = req.query;
  console.log({ sender, receiver });
  try {
    // Convert sender and receiver to ObjectId
    const senderId = new mongoose.Types.ObjectId(sender);
    const receiverId = new mongoose.Types.ObjectId(receiver);

    const pipeline = [
      {
        $match: {
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        },
      },
    ];

    const results = await Message.aggregate(pipeline).exec();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

exports.postMessage = async (req, res) => {
  const message = new Message(req.body);
  try {
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404).send({ error: "Message not found" });
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) {
      res.status(404).send({ error: "Message not found" });
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
};
