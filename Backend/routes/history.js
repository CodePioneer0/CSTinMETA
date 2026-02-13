const express = require("express");
const router = express.Router();
const SugarEvent = require("../models/SugarEvent");
const Gamification = require("../models/Gamification");
const Insight = require("../models/Insight");
const auth = require("../middleware/auth");
const User = require("../models/User");

//get sugar history for last n days
router.get("/sugar/history", auth, async (req, res) => {
  try {
    const { anonymousId } = req.user;
    const days = req.query.days ? Number(req.query.days) : 7;

    const user = await User.findOne({ anonymousId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await SugarEvent.find({
      userId: user._id,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    return res.status(200).json({
      message: "Sugar history fetched successfully",
      count: history.length,
      history
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//get insight history for last n days
router.get("/insights/history", auth, async (req, res) => {
  try {
    const { anonymousId } = req.user;
    const days = req.query.days ? Number(req.query.days) : 7;

    const user = await User.findOne({ anonymousId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const insights = await Insight.find({
      userId: user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Insights history fetched successfully",
      count: insights.length,
      insights
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all badges
router.get("/badges", auth, async (req, res) => {
  try {
    const { anonymousId } = req.user;

    const user = await User.findOne({ anonymousId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const gamification = await Gamification.findOne({ userId: user._id });
    if (!gamification) {
      return res.status(404).json({ message: "Gamification not found" });
    }

    return res.status(200).json({
      message: "Badges fetched successfully",
      badges: gamification.badges
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
