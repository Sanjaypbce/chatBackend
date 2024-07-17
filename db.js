const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MongoDb_Url);
    console.log("CONNECTED TO DATABASE IS SUCCESSFULLY");
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectDb;
