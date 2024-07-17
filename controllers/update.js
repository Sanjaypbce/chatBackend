const asynHandler = require("express-async-handler");
const verifyUser = require("../models/verifyUser");

const updateUser = asynHandler(async (req, res) => {
  const Goal = await verifyUser.findById(req.params.id);

  console.log(Goal);

  if (!Goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  console.log(req.body);

  await verifyUser.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: `update  user  ${req.params.id}`,
  });
});

module.exports = { updateUser };
