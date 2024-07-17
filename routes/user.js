const express = require("express");
var router = express.Router();
const { authenticateJWT } = require("../middleware/authenticate");
const { getUserData } = require("../controllers/user");

router.get("/", async (req, res) => {
  authenticateJWT(req, res, getUserData);
});
module.exports = router;
