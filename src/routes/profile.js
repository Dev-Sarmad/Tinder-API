const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

//get user profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
