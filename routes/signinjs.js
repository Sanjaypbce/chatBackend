const express = require("express");
const { model } = require("mongoose");
const { CheckUser } = require("../controllers/login");
const { InsertverifyUser } = require("../controllers/signin");
const { GetDatabase } = require("../controllers/home");
const { deleUser } = require("../controllers/delete");
const { updateUser } = require("../controllers/update");
var router = express.Router();

router.get("/", async (req, res) => {
  GetDatabase(req, res);
});
router.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertverifyUser(name, email, password);
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send(false);
    } else if (registerCredentials === "server busy") {
      res.status(500).send("server busy");
    }
  } catch (e) {}
});

router.delete("/:id", async (req, res) => {
  deleUser(req, res);
});

router.put("/:id", async (req, res) => {
  updateUser(req, res);
});

module.exports = router;
