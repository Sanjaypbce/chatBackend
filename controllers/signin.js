const user = require("../models/User");
const { sendmail } = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertverifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newuser = new verifyUser({
      name: name,
      email: email,
      password: hashpassword,
      token: token,
    });

    await newuser.save();

    // const activationLink = "link to be added"
    // const content =`<h4>Hii,there</h4>
    // <h5>Welcome to the app</h5>
    // <p>Thank you for signin to click on the below link to activate</p>
    // <a href="${activationLink}">click here</a>
    // <p>Regards</P>
    // <p>Team</P>`

    // sendmail(email,"VerifyUser",content)
  } catch (e) {
    console.log(e);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

module.exports = { InsertverifyUser };
