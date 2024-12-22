const express = require("express");
const { userAuth } = require("../middlewares/auth");
const validateProfileEdits = require("../utils/validate");

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

profileRouter.patch("/profile/edit/", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdits(req)) {
      throw new Error("Invalid profile edit request ");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(`${loggedInUser.firstName} profile was updated`);
    loggedInUser.save();
    res.send(loggedInUser).status(200);
  } catch (error) {
    res.send("Error accured due to " + error.message);
  }
});

module.exports = profileRouter;
