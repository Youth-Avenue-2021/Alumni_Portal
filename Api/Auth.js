const express = require("express");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const auth = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

auth.post("/login", async (req, res) => {
  // getting all credentials from request
  const { username, password } = req.body;

  try {
    // check user exist or not?
    const user = await User.findOne({ username: username });
    if (user) {
      // If user exist then compare password with req. and stored password.
      const isMatch = await bcrypt.compare(password, user.password);

      // if not match
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      // JWT Process
      const payLoad = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payLoad, process.env.SECRET_KEY, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        // console.log(token);
        res.json({ token: token, msg: "You are logged In" });
        // we can store response token into local storage.
      });
    }
  } catch (error) {
    res.status(500).send("server error");
  }
});

module.exports = auth;
