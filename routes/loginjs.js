const express = require("express");
const { model } = require("mongoose");
var router = express.Router();

const { authenticateUser } = require("../controllers/login");

const verifyUser = require("../models/verifyUser");
const { GetDatabase } = require("../controllers/home");
const { authenticateJWT } = require("../middleware/authenticate");

const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    res.status(500).send("server busy");
  }
});

router.get("/getAllUsers/", async (req, res) => {
  // authenticateJWT(req, res, GetDatabase);
  GetDatabase(req, res);
});

module.exports = router;
