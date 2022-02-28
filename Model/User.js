const mongoose = require("mongoose");

// connection with mongoose
mongoose
  .connect("mongodb://localhost/userDatabase")
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.error("could not connect to db.", err));

// creating user schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// create a userData named collection
const userData = mongoose.model("userData", userSchema);

module.exports = userData;
