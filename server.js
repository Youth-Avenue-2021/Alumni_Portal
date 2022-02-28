const express = require("express");
const app = express();
const user = require("./Api/User");
const auth = require("./Api/Auth");
require("dotenv");
const PORT = 3000 || process.env.PORT;

// middleware to get parsed json data from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", user);
app.use("/api/user", auth);

app.get("/", (req, res) => {
  console.log(req.path);
  res.status(400).send("Done");
});

app.listen(PORT, () => {
  console.log(`Your app is running at ${PORT}`);
});
