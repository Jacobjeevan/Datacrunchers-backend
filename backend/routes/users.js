const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const { authenticate } = require("passport");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "User not found!" });
};

router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  User.register(new User({ username, email }), password, (err, user) => {
    if (err) {
      console.log("Registration Error: " + err);
      return res.status(500).json({ error: err });
    } else {
      return res.json(user);
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  function (req, res) {
    if (req.isAuthenticated()) {
      res.json(req.user);
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  return res.sendStatus(200);
});

module.exports = router;
