const asynHandler = require("express-async-handler");
const verifyUser = require("../models/verifyUser");

const deleUser = asynHandler(async (req, res) => {
  const Goal = await verifyUser.findById(req.params.id);

  if (!Goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  //   await Goals.romove();

  verifyUser.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
  });

  res.status(200).json({
    message: `delete Goal ${req.params.id}`,
  });
});

module.exports = {deleUser}