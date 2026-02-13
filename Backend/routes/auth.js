const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const JWT_SECRET = process.env.JWT_SECRET;

// signup (upgrade anonymous user)
router.post("/signup", auth, async (req, res) => {
  try {
    const { anonymousId } = req.user;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.findOne({ anonymousId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.email = email;
    user.passwordHash = hashedPassword;
    user.isSignedUp = true;

    await user.save();

    const token = jwt.sign(
      { anonymousId: user.anonymousId },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Signup successful",
      token,
      email: user.email,
      isSignedUp: user.isSignedUp
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { anonymousId: user.anonymousId },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      anonymousId: user.anonymousId
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
