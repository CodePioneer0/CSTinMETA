const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {body,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const Gamification = require("../models/Gamification");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
//User creation(Signup Free)
router.post("/session/start", async (req, res) => {
    try {
        const anonymousId = uuidv4();
        const user = await User.findOne({ anonymousId });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const newUser = new User({
            anonymousId
        })
        await newUser.save();
        const gamification = new Gamification({
            userId: newUser._id,
            xp: 0,
            level: 1,
            streakCount: 0,
            bestStreak: 0,
            lastLogDate: null,
            badges: []
        });
        await gamification.save();
        const token = jwt.sign({ anonymousId }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "User created successfully",
            token,
            anonymousId,
            onboardingCompleted: false
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

//User onboarding
router.put("/onboarding", auth,[
    body("dob","dob is required").isDate(),
    body("gender","gender is required").isIn(["MALE", "FEMALE", "OTHER"]),
    body("height","height is required").isInt(),
    body("weight","weight is required").isInt()
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }
    try {
        const { anonymousId } = req.user;
        const user = await User.findOne({ anonymousId });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const { dob, gender, height, weight } = req.body;

        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();

            let finalAge = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                finalAge--;
            }
            user.age = finalAge;
        }
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        user.dob = dob;
        user.gender = gender;
        user.heightCm = height;
        user.weightKg = weight;
        user.bmi = bmi.toFixed(2);
        user.onboardingCompleted = true;
        await user.save();
        return res.status(200).json({
            message: "User onboarding completed successfully",
            user: {
                anonymousId: user.anonymousId,
                age: user.age,
                gender: user.gender,
                heightCm: user.heightCm,
                weightKg: user.weightKg,
                bmi: user.bmi,
                onboardingCompleted: user.onboardingCompleted
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

module.exports = router;