const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, password, email, gender, age } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      age,
      password: passwordHash,
    });
    console.log(user);
    await user.save();
          //create a jwt token and send back to the user verfied account
          const token = await user.getJWT();
          res.cookie("token", token);
    res.send("user created successfully");
  } catch (error) {
    console.log(error);
  }
});

//login APi
authRouter.post("/login",  async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send("Account with this email not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
          res.cookie("token", token);
      res.status(200).send("login successful");
    } else {
      res.send("invalid credetials");
    }
  } catch (error) {
    console.log(error);
  }
});

//logout api
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfully");
});

module.exports = authRouter;
