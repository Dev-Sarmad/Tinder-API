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
      const responseMessage =
        status == "interested"
          ? `Connection request sent to ${existUserInDB.firstName}`
          : `You ignored ${existUserInDB.firstName}`;
      res.json({ message: responseMessage });
    } catch (error) {
      res.status(400).send("request sending failed due to" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    // sarmad => ayesha
    // ayesha should be logged in to see
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.send("Invalid status");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        //status  should only be interested in connection request collections
        status: "interested",
        //request id is the connection request collection id
        _id: requestId,
        // the loggedin user which received the request
        toUserId: loggedInUser._id,
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;
      const reviewRequest = await connectionRequest.save();
      res.json({ reviewRequest });
    } catch (error) {
      res
        .status(400)
        .json({ message: `something wen wrong due to` + error.message });
    }
  }
);

module.exports = requestRouter;
