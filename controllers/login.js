const verifyUser = require("../models/verifyUser");
const bcrypt = require("bcrypt");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

async function CheckUser(email) {
  try {
    const user = await verifyUser.findOne({ email: email });
    console.log(user, "check");
    if (user) {
      return true;
    }
    return false;
  } catch (e) {
    return "server busy";
  }
}

async function authenticateUser(email, password) {
  try {
    const user = await verifyUser.findOne({ email: email });

    if (!user) {
      return false;
    }

    const hashedPassword = user.password;
    const passwordAttempt = password;

    const result = await bcrypt.compare(passwordAttempt, hashedPassword);

    if (result) {
      const token = generateTokenLogin(email);
      const response = {
        _id: user._id,
        name: user.name,
        password: user.password,
        token: token,
        status: true,
      };

      await client.set(`key-${email}`, JSON.stringify(response));
      await verifyUser.findOneAndUpdate(
        { email: email },
        { $set: { token: response.token } },
        { new: true }
      );

      console.log({ response });
      return response;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ERROR OCCUR:", error);
    throw error;
  }
}

function generateTokenLogin(email) {
  const token = jwt.sign(email, process.env.login_secret_Token);
  return token;
}

module.exports = { CheckUser, authenticateUser };
