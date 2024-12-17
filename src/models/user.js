const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      //validate method only called when the new document is created in DB
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Invalid gender: " + value);
        }
      },
    },
    email: {
      type: String,
      required: true,
      //means emailID should be unique otherwise it didnt save in the database
      unique: true,
      lowercase: true,
      //if there are spaces in the email remove the spaces by trim
      trim: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please provide a valid email address",
      ],
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5; // Ensure array length is not greater than 10
        },
        message: "You must specify no more than 10 skills", // Updated error message
      },
    },
    about: {
      type: String,
      default: "This is the user ABOUT section",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
