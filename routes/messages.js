const express = require("express");
const Message = require("../models/message");
const { authenticateJWT } = require("../middleware/authenticate");
const messageController = require("../controllers/message");

var router = express.Router();

router.get("/", async (req, res) => {
  authenticateJWT(req, res, messageController.getAllMessages);
});

router.post("/", async (req, res) => {
  authenticateJWT(req, res, messageController.postMessage);
});

router.delete("/:id", async (req, res) => {
  authenticateJWT(req, res, messageController.deleteMessage);
});
router.put("/:id", async (req, res) => {
  authenticateJWT(req, res, messageController.deleteMessage);
});

module.exports = router; // Corrected export
