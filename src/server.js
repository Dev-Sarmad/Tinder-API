const express = require("express");
//importing the function 
const connectionDB = require("./config/db");

//initializing the app using the express
const app = express();

//calling the connectionDB function and it will connects database
//  and then it connects to the server
connectionDB().then(() => {
  console.log("database connected suucessfully");
  app.listen(3000, () => console.log("app is running properly"));
});

// this is the main file