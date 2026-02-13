const mongoose = require("mongoose");

const GamificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    xp: {
      type: Number,
      default: 0
    },

    level: {
      type: Number,
      default: 1
    },

    streakCount: {
      type: Number,
      default: 0
    },

    bestStreak: {
      type: Number,
      default: 0
    },

    lastLogDate: {
      type: String, // "YYYY-MM-DD"
      default: null
    },

    badges: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gamification", GamificationSchema);
