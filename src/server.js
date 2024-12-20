const express = require("express");
//importing the function
const connectionDB = require("./config/db");

const User = require("./models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

//auth middleware
const { userAuth } = require("./middlewares/auth");

const cookieParser = require("cookie-parser");
//initializing the app using the express
const app = express();

app.use(express.json());

//to read the cookie we need a middleware called Cookie-parser
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

    res.send("user created successfully");
  } catch (error) {
    console.log(error);
  }
});

//login APi
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send("Account with this email not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a jwt token and send back to the user verfied account
      const token = await jwt.sign({ _id: user.id }, "secretkeyhere");
      res.cookie("token", token);
      res.status(200).send("login successful");
    } else {
      res.send("invalid credetials");
    }
  } catch (error) {
    console.log(error);
  }
});
//get user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/user", async (req, res) => {
  const username = req.body.firstName;
  try {
    const user = await User.findOne({
      firstName: { $regex: new RegExp(username, "i") },
    });

    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send("Something went wrong due to" + error);
  }
});

// get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong due to" + error);
  }
});

//delete user from the DB by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong due to" + error);
  }
});

//update user profile by id
app.patch("/user/:userId", async (req, res) => {
  //userId
  const userId = req.params?.userId;
  //data we want to update via client request
  const data = req.body;
  try {
    const allowedEntites = ["skills", "about", "gender", "age"];
    const allowedUpdates = Object.keys(data).every((k) =>
      allowedEntites.includes(k)
    );
    if (!allowedUpdates) {
      throw new Error("Updates are not allowed");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("user updated successfully");
  } catch (error) {
    res.status(500).send("Something went wrong due to" + error);
  }
});
//calling the connectionDB function and it will connects database
//  and then it connects to the server
connectionDB().then(() => {
  console.log("database connected suucessfully");
  app.listen(3000, () => console.log("app is running properly"));
});

// this is the main file
