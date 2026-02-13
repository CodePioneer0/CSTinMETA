const mongoose = require("mongoose");

const RewardLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    eventType: {
      type: String,
      enum: ["SUGAR_LOG", "ACTION_COMPLETE"],
      required: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    basePoints: {
      type: Number,
      default: 0
    },

    bonusPoints: {
      type: Number,
      default: 0
    },

    totalPoints: {
      type: Number,
      required: true
    },

    surpriseReward: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

RewardLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("RewardLog", RewardLogSchema);