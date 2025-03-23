const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token;

    console.log(req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(token)
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      if (user.accountStatus !== "active") {
        return res.status(401).json({
          success: false,
          error: "Your account is not active",
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
