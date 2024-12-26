const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    })
      .populate("fromUserId", UserSafeData)
      .populate("toUserId", UserSafeData);
    const data = connectionRequest.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );

    res.json({ message: "geting connections", data });
  } catch (error) {
    res.send("Something went wrong", error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //i dont want users which have send the request to me and i have send the request to them
    //and also dont want to see in feed which are already in my connections
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    });

    //set  is a data structure which add the elements into an array but not those which are already present
    const hideFromUserFeed = new Set();
    connectionRequests.forEach((row) => {
      hideFromUserFeed.add(row.fromUserId.toString());
      hideFromUserFeed.add(row.toUserId.toString());
    });

    const allUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromUserFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(UserSafeData)
      .skip(skip)
      .limit(limit);
    res.json({ message: "data except from loggedinUser", data: allUsers });
  } catch (error) {
    res.send("Something went wrong", error.message);
  }
});

module.exports = userRouter;
