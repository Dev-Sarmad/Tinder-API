const express = require("express");
//importing the function
const connectionDB = require("./config/db");

const User = require("./models/user");

//initializing the app using the express
const app = express();

//our express server does not accept the javascript object from the client so we use the middelware
//app.use(this middleware will be used across all the application)
app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating the new instance of user model
  //earlier we were not sending the javascript object to the server via client
  //instead we were creating the object on server itself here we will be sending data to the server
  const user = new User(req.body);
  console.log(user);
  //this object will be saved in the database
  //all of the mongoose functions either you are getting , savnig data into the database
  // It will return you a promise so we use await here
  try {
    await user.save();

    res.send("user created successfully");
  } catch (error) {
    console.log(error);
  }
});

//calling the connectionDB function and it will connects database
//  and then it connects to the server
connectionDB().then(() => {
  console.log("database connected suucessfully");
  app.listen(3000, () => console.log("app is running properly"));
});

// this is the main file
