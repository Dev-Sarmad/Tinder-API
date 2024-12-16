const express = require("express");
//importing the function
const connectionDB = require("./config/db");

const User = require("./models/user");

//initializing the app using the express
const app = express();

app.post("/signup", async (req, res) => {
  //creating the new instance of user model
  const user = new User({
    firstName: "Sam",
    lastName: "habib",
    email: "sam@gmail.com",
    password: "alpha123",
    age: 20,
    gender: "male",
  });
  //this object will be saved in the database
  //all of the mongoose functions either you are getting , savnig data into the database
  // It will return you a promise so we use await here
  await user.save();

  res.send("user created successfully");
});

//calling the connectionDB function and it will connects database
//  and then it connects to the server
connectionDB().then(() => {
  console.log("database connected suucessfully");
  app.listen(3000, () => console.log("app is running properly"));
});

// this is the main file
