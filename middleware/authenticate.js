const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.login_secret_Token;

const authenticateJWT = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log({ err });
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded; // You can access the decoded user data in your route handlers
    next(req, res);
  });
};

module.exports = { authenticateJWT };
