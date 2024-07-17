const verifyUser = require("../models/verifyUser");
const Client = require("../redis");

const getUserData = async (req, res) => {
  const email = req.user;

  try {
    // Check if user data is in Redis
    const userData = await Client.get(`key-${email}`);

    if (userData) {
      return res.status(200).json(JSON.parse(userData));
    } else {
      // User not found in Redis, check MongoDB
      const user = await verifyUser.findOne({ email: email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Store user data in Redis
      await Client.set(`key-${email}`, JSON.stringify(user));

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).send("Server error");
  }
};

module.exports = { getUserData };
