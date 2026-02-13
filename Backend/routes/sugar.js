const express = require("express");
const router = express.Router();
const SugarEvent = require("../models/SugarEvent");
const Gamification = require("../models/Gamification");
const Insight = require("../models/Insight");
const Action = require("../models/Action");
const HealthDaily = require("../models/HealthDaily");
const RewardLog = require("../models/RewardLog");
const auth = require("../middleware/auth");
const User = require("../models/User");
const axios = require("axios");
const { body, validationResult } = require("express-validator");

function getDateString(dateObj) {
    return dateObj.toISOString().split("T")[0];
}

function getTimeofDay(dateObj) {
    const hour = dateObj.getHours();
    if (hour >= 5 && hour < 12) return "MORNING";
    if (hour >= 12 && hour < 17) return "AFTERNOON";
    if (hour >= 17 && hour < 22) return "EVENING";
    return "NIGHT";
}

function isYesterday(lastDateStr, todayStr) {
    const last = new Date(lastDateStr);
    const today = new Date(todayStr);

    const diff = (today - last) / (1000 * 60 * 60 * 24);
    return diff === 1;
}

function estimateSugarGrams(itemType) {
    const sugarMap = {
        CHAI: 12,
        COFFEE: 8,
        SWEETS: 25,
        COLD_DRINK: 35,
        PACKAGED_SNACK: 18,
        ICE_CREAM: 20,
        CHOCOLATE: 15,
        JUICE: 22,
        OTHER: 10
    };

    return sugarMap[itemType] || 10;
}


//log sugar event
router.post("/log", auth, [
    body("itemType").notEmpty().withMessage("itemType is required").isIn(["CHAI","COFFEE","SWEETS","COLD_DRINK","PACKAGED_SNACK","ICE_CREAM","CHOCOLATE","JUICE","OTHER"]).withMessage("Invalid itemType"),
    body("quantity").optional().isInt({ gt: 0 }).withMessage("quantity must be a positive number"),
    body("timestamp", "timestamp is required").isISO8601().withMessage("timestamp must be a valid ISO 8601 date-time")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Invalid request",
            errors: errors.array()
        });
    }

    try {
        const { anonymousId } = req.user;
        const user = await User.findOne({ anonymousId });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (!user.onboardingCompleted) {
            return res.status(400).json({ message: "Complete onboarding first" });
        }
        const { itemType, quantity, timestamp } = req.body;
        const timeStampObj = timestamp ? new Date(timestamp) : new Date();
        const date = getDateString(timeStampObj);

        const timeOfDay = getTimeofDay(timeStampObj);

        const sugarEvent = new SugarEvent({
            userId: user._id,
            itemType,
            quantity,
            timestamp: timeStampObj,
            date,
            timeOfDay
        });

        await sugarEvent.save();

        //get gamification record
        let gamification = await Gamification.findOne({ userId: user._id });

        if (!gamification) {
            gamification = new Gamification({
                userId: user._id,
                xp: 0,
                level: 1,
                streakCount: 0,
                bestStreak: 0,
                lastLogDate: null,
                badges: []
            });
        }

        //streak logic
        if (!gamification.lastLogDate) {
            gamification.streakCount = 1;
        } else if (gamification.lastLogDate === date) {
            //same day, no change
        } else if (isYesterday(gamification.lastLogDate, date)) {
            gamification.streakCount += 1;
        } else {
            gamification.streakCount = 1;
        }

        gamification.lastLogDate = date;
        gamification.bestStreak = Math.max(gamification.bestStreak, gamification.streakCount);

        //xp logic
        let basePoints = 5;
        let bonusPoints = 0;
        //bonus if user logs before 6pm
        if (timeStampObj.getHours() < 18) {
            bonusPoints += 3;
        }
        // Variable reward (random bonus)
        const randomRoll = Math.random();
        let surpriseReward = false;

        if (randomRoll < 0.6) {
            bonusPoints += 0;
        } else if (randomRoll < 0.8) {
            bonusPoints += 2;
            surpriseReward = true;
        } else if (randomRoll < 0.95) {
            bonusPoints += 5;
            surpriseReward = true;
        } else {
            bonusPoints += 10;
            surpriseReward = true;
        }

        const totalPoints = basePoints + bonusPoints;
        gamification.xp += totalPoints;

        //level up logic
        gamification.level = Math.floor(gamification.xp / 100) + 1;

        // Badge logic
        if (!gamification.badges.includes("FIRST_LOG")) {
            gamification.badges.push("FIRST_LOG");
        }

        if (gamification.streakCount >= 3 && !gamification.badges.includes("DAY_3_STREAK")) {
            gamification.badges.push("DAY_3_STREAK");
        }

        if (gamification.streakCount >= 7 && !gamification.badges.includes("DAY_7_STREAK")) {
            gamification.badges.push("DAY_7_STREAK");
        }

        if (gamification.streakCount >= 30 && !gamification.badges.includes("DAY_30_STREAK")) {
            gamification.badges.push("DAY_30_STREAK");
        }

        await gamification.save();
        // Save reward log
        await RewardLog.create({
            userId: user._id,
            eventType: "SUGAR_LOG",
            referenceId: sugarEvent._id,
            basePoints,
            bonusPoints,
            totalPoints,
            surpriseReward
        });
        //fetching health record for today
        const healthToday = await HealthDaily.findOne({ userId: user._id, date });
        const stepsToday = healthToday ? healthToday.steps : 0;
        const sleepMinutes = healthToday ? healthToday.sleepMinutes : 0;
        const sugarCountToday = await SugarEvent.countDocuments({ userId: user._id, date });
        // weekly sugar count (last 7 days including today)
        const weekStart = new Date(timeStampObj);
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(timeStampObj);
        weekEnd.setHours(23, 59, 59, 999);

        const sugarCountWeek = await SugarEvent.countDocuments({
            userId: user._id,
            timestamp: { $gte: weekStart, $lte: weekEnd }
        });


        const estimatedUnitSugar = estimateSugarGrams(itemType);
        const finalQuantity = quantity || 1;
        const totalEstimatedSugar = estimatedUnitSugar * finalQuantity;

        //ML features
        const features = {
            bmi: user.bmi,
            steps_today: stepsToday,
            sleep_minutes: sleepMinutes,
            time_of_day: timeOfDay,
            sugar_type: itemType,
            sugar_count_today: sugarCountToday,
            sugar_count_week: sugarCountWeek,
            estimated_sugar_grams: totalEstimatedSugar
        };
        //Calling Ml microservice
        let mlResult = null;
        try {
            const mlResponse = await axios.post("http://localhost:5000/predict", features);
            mlResult = mlResponse.data;
        } catch (error) {
            // fallback if ML service fails
            mlResult = {
                risk_tag: "HIGH_SUGAR_HABIT",
                risk_score: 0.5,
                insight_text: "Frequent sugar intake can affect energy and sleep quality.",
                suggested_action: "DRINK_WATER",
                explanation: "Default fallback suggestion"
            };
        }

        //save insight
        const insight = await Insight.create({
            userId: user._id,
            sugarEventId: sugarEvent._id,
            riskTag: mlResult.risk_tag,
            riskScore: mlResult.risk_score,
            insightText: mlResult.insight_text,
            suggestedAction: mlResult.suggested_action,
            explanation: mlResult.explanation,
            modelVersion: "v1"
        });
        // Create pending action
        const action = await Action.create({
            userId: user._id,
            sugarEventId: sugarEvent._id,
            actionType: mlResult.suggested_action,
            status: "PENDING",
            suggestedAt: new Date()
        });

        return res.status(201).json({
            message: "Sugar event logged successfully",
            sugarEvent,
            pointsAwarded: totalPoints,
            basePoints,
            bonusPoints,
            surpriseReward,
            streakCount: gamification.streakCount,
            bestStreak: gamification.bestStreak,
            xp: gamification.xp,
            level: gamification.level,
            insight,
            action
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//action
router.post("/action/complete", auth, async (req, res) => {
    try {
        const { anonymousId } = req.user;
        const { sugarEventId } = req.body;
        if (!sugarEventId) {
            return res.status(400).json({ message: "sugarEventId is required" });
        }

        const user = await User.findOne({ anonymousId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const action = await Action.findOne({ userId: user._id, sugarEventId });
        if (!action) return res.status(404).json({ message: "Action not found" });

        if (action.status === "COMPLETED") {
            return res.status(200).json({ message: "Action already completed", action });
        }

        const now = new Date();
        const diffMinutes = (now - new Date(action.suggestedAt)) / 60000;
        let points = 3;
        let completedWithin30Min = false;
        if (diffMinutes <= 30) {
            points = 7;
            completedWithin30Min = true;
        }
        action.status = "COMPLETED";
        action.completedAt = now;
        action.completedWithin30Min = completedWithin30Min;
        await action.save();

        //gamification
        const gamification = await Gamification.findOne({ userId: user._id });
        if (!gamification) {
            return res.status(404).json({ message: "Gamification not found" });
        }
        gamification.xp += points;
        gamification.level = Math.floor(gamification.xp / 100) + 1;
        // Badge unlock
        let badgeUnlocked = null;

        if (completedWithin30Min && !gamification.badges.includes("QUICK_FIXER")) {
            gamification.badges.push("QUICK_FIXER");
            badgeUnlocked = "QUICK_FIXER";
        }
        await gamification.save();

        //reward log
        await RewardLog.create({
            userId: user._id,
            eventType: "ACTION_COMPLETE",
            referenceId: action._id,
            basePoints: points,
            bonusPoints: 0,
            totalPoints: points,
            surpriseReward: false
        });

        return res.status(200).json({
            message: "Action completed successfully",
            pointsAwarded: points,
            badgeUnlocked,
            xp: gamification.xp,
            level: gamification.level,
            action
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;