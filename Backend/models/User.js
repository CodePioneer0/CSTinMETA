const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    anonymousId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    isSignedUp: {
      type: Boolean,
      default: false
    },

    dob: {
      type: Date,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: null
    },
    heightCm: {
      type: Number,
      default: null
    },
    weightKg: {
      type: Number,
      default: null
    },
    bmi: {
      type: Number,
      default: null
    },

    onboardingCompleted: {
      type: Boolean,
      default: false
    },

    healthPermission: {
      steps: { type: Boolean, default: false },
      sleep: { type: Boolean, default: false },
      heartRate: { type: Boolean, default: false }
    },

    lastActiveDate: {
      type: String, // "YYYY-MM-DD"
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
