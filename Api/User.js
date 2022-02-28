const express = require("express");
const User = require("../Model/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = express.Router();

// check validation... (if !true => msg send)
const validator = [check("username", "Name is invalid").not().isEmpty().isLength({ min: 4 }), check("fullname", "Name is required").not().isEmpty(), check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })];

user.post("/register", validator, (req, res) => {
  // check if any validation is not true then send error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.errors });
  }

  // creating user
  const createUser = async () => {
    // getting all data from req. using destructuring array
    const { username, password, email, fullname } = req.body;

    // if any error occurred then catch
    try {
      const emailExist = await User.findOne({ email: email });

      // if email exist in database then say email already exist
      if (emailExist) {
        return res.status(400).json({ error: "Email already exist." });
      }

      // same for username
      const usernameExist = await User.findOne({ username: username });
      if (usernameExist) {
        return res.status(400).json({ error: "Username is already exist." });
      }

      // set all new data for user to store in database
      const userData = new User({
        fullname,
        username,
        password,
        email,
      });

      // before save password as plain text, encrypting
      const sault = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, sault);

      // everything okay, save user in database
      await userData.save();

      // Return JSON Web Token (JWT)
      // JWT Basically used for access protected routes
      const payLoad = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payLoad, process.env.SECRET_KEY, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        // console.log(token);
        res.json({ token: token, msg: "User Registered" });
      });
    } catch (err) {
      console.log("error : ", err);
    }
  };

  // call asynchronous create user FN.
  createUser();
});

module.exports = user;
