const express = require("express");
const router = express.Router();
const SugarEvent = require("../models/SugarEvent");
const Gamification = require("../models/Gamification");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/", auth, async (req, res) => {
    try {
        const { anonymousId } = req.user;
        const user = await User.findOne({ anonymousId });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        if (!user.onboardingCompleted) {
            return res.status(200).json({
                onboardingCompleted: false,
                message: "User is not onboarded"
            })
        }
        let gamification = await Gamification.findOne({ userId: user._id });
        if (!gamification) {
            gamification = new Gamification({
                userId: user._id,
                xp: 0,
                level: 1,
                badges: [],
                streakCount: 0,
                bestStreak: 0,
                lastLogDate: null
            })
            await gamification.save();
        }
        const todayDate = new Date().toISOString().split("T")[0];
        const todaySugarLogs = await SugarEvent.find({ userId: user._id, date: todayDate });

        let sugarScore = 100 - todaySugarLogs.length * 20;//higher sugar logs -> lower sugar score
        if (sugarScore < 0) sugarScore = 0;

        return res.status(200).json({
            onboardingCompleted: true,
            xp: gamification.xp,
            level: gamification.level,
            streakCount: gamification.streakCount,
            bestStreak: gamification.bestStreak,
            todaySugarLogs,
            sugarScore,
            badges: gamification.badges
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

module.exports = router;