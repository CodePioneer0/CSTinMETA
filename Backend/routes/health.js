const express = require("express");
const router = express.Router();
const User = require("../models/User");
const HealthDaily = require("../models/HealthDaily");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// get user permission flags
router.get("/permissions", auth, async (req, res) => {
  try {
    const { anonymousId } = req.user;
    const user = await User.findOne({ anonymousId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      permissions: user.healthPermission
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// stores user permission flags
router.put("/connect", auth, [
  body("steps").isBoolean().withMessage("steps must be boolean"),
  body("sleep").isBoolean().withMessage("sleep must be boolean"),
  body("heartRate").isBoolean().withMessage("heartRate must be boolean")
],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { anonymousId } = req.user;

      const user = await User.findOne({ anonymousId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { steps, sleep, heartRate } = req.body;

      user.healthPermission.steps = steps;
      user.healthPermission.sleep = sleep;
      user.healthPermission.heartRate = heartRate;

      await user.save();

      return res.status(200).json({
        message: "User health permission stored successfully",
        healthPermission: user.healthPermission
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// store daily health summary
router.post("/sync", auth, [
  body("steps").isNumeric().withMessage("steps must be a number"),
  body("sleepMinutes").optional().isNumeric().withMessage("sleepMinutes must be a number"),
  body("avgHeartRate").optional().isNumeric().withMessage("avgHeartRate must be a number"),
  body("source").optional().isIn(["SIMULATED", "GOOGLE_FIT", "APPLE_HEALTH"])
],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { anonymousId } = req.user;

      const user = await User.findOne({ anonymousId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const date = new Date().toISOString().split("T")[0];

      const { steps, sleepMinutes, avgHeartRate, source } = req.body;

      const healthData = await HealthDaily.findOneAndUpdate(
        { userId: user._id, date },
        {
          $set: {
            steps,
            sleepMinutes: sleepMinutes ?? null,
            avgHeartRate: avgHeartRate ?? null,
            source: source || "SIMULATED"
          }
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: "User health summary stored successfully",
        healthDaily: healthData
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
