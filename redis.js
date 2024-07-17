const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();

// Create a Redis client

// Call the function to create a Redis client instance
const client = redis.createClient({
  url: process.env.Redis_End_pont,
});

client.on("error", (error) => {
  console.log(error);
});
client.on("connect", async () => {
  console.log("redis is connected successfull");
});
client.on("end", () => {
  console.log("redis connection ended");
});
client.on("SIGQUIT", (error) => {
  client.quit();
});

module.exports = client;
