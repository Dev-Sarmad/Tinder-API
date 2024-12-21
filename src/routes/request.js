const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = request.user;
  console.log("sending the connection request");
  res.send("Connection request send by" + user.firstName);
});

module.exports = requestRouter;
