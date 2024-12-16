const mongoose = require("mongoose");

//create a async function which connect to your databa using mongoose library
async function connectionDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://sarmadh230:WuOKFuWAGFb0Dkmx@cluster0.ujm4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (error) {
    console.log(error);
  }
}
//export this function 
module.exports = connectionDB;
