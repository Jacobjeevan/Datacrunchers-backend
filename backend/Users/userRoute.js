const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("./userModel");
const { authenticate } = require("passport");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "User not found!" });
};

const getUser = (user) => {
  return { userId: user._id, username: user.username, role: user.role };
};

router.get("/user", (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.json(null);
  }
});

router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  User.register(new User({ username, email }), password, (err, user) => {
    if (err) {
      console.log("Registration Error: " + err);
      return res.status(500).json({ error: err });
    } else {
      req.session.user = getUser(user);
      return res.json(req.session.user);
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  function (req, res) {
    if (req.isAuthenticated()) {
      req.session.user = getUser(req.user);
      res.json(req.session.user);
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    if (err) {
      return res.status(400).send(
        JSON.stringify({
          success: false,
          error: err,
        })
      );
    }
    res.clearCookie(process.env.Session_name);
    return res.sendStatus(200);
  });
});

module.exports = router;
