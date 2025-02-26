const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

const userOnly = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Only users can perform this action" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action" });
  }
};

module.exports = { protect, userOnly, adminOnly };
