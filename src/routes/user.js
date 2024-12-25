const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const UserSafeData = "firstName  lastName gender age photoUrl";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    //this user received the request
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      //only want the interested requests
      status: "interested",
      //this will fetched the specific info of that user
    }).populate("fromUserId", [
      "firstName",
      "age",
      "gender",
      "about",
      "photoUrl",
    ]);
    res.status(200).json({
      data: connectionRequest,
      message: "requests fetched successfully",
    });
  } catch (error) {
    res.send("Something went wrong", error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        //checking either user sent request status == accepted or received request status == accepted
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", UserSafeData);
    const data = connectionRequest.map((row) => row.fromUserId);

    res.json({ message: "geting connections", data });
  } catch (error) {
    res.send("Something went wrong", error.message);
  }
});

module.exports = userRouter;