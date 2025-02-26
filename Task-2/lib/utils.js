const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, 
    sameSite: "strict", 
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

const generateRefreshToken = (userId, res) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", 
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return refreshToken;
};

module.exports = { generateToken, generateRefreshToken };
