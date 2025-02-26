const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateToken, generateRefreshToken } = require("../lib/utils");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      const accessToken = generateToken(newUser._id, res);
      const refreshToken = generateRefreshToken(newUser._id, res);

      newUser.refreshToken = refreshToken;
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accessToken,
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateToken(user._id, res);
    const refreshToken = generateRefreshToken(user._id, res);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.refreshToken = "";
    await user.save();

    res.clearCookie("jwt");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout };