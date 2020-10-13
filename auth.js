const User = require("./Users/userModel");

const checkUserPermissions = (req, res, next) => {
  if (req.session.user) {
    let foundUser = User.findById({ _id: req.session.user._id });
    if (foundUser /* && foundUser.Role == "officer" */) {
      return next();
    } else {
      return res.status(400).json({
        error: "User does not have appropriate permissions for this action",
      });
    }
  }
  return res.status(404).json({ error: "User not found" });
};

module.exports = checkUserPermissions;
