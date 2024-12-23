const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // this will be coming from the  userAuth (req.user = user)
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.send("Invalid connection status" + status);
      }
      const existUserInDB = await User.findById(toUserId);
      if (!existUserInDB)
        return res.status(404).json({ message: "User does not exist" });
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, // check if request is already sent or nor
          { fromUserId: toUserId, toUserId: fromUserId }, // make sure both cant send request of
          //one has already been sent
        ],
      });
      if (existingConnectionRequest) {
        return res.json({ message: "Connection request already exists  " });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const request = await connectionRequest.save();
      const response =
        status === " interested"
          ? `${req.user.firsName} is interested in ${toUserId.firstName}`
          : `You ignored ${toUserId.firstName}`;
      res.json({ message: response, request });
    } catch (error) {
      res.status(400).send("request sending failed due to" + error.message);
    }
  }
);

module.exports = requestRouter;
