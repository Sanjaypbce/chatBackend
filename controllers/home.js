const mongoose = require("mongoose");
const verifyUser = require("../models/verifyUser");

async function GetDatabase(req, res) {
  try {
    const users = await verifyUser.find();
    console.log("user", users);
    res.status(200).send(users);
  } catch (e) {
    console.log(e);
  }
}

module.exports = { GetDatabase };
