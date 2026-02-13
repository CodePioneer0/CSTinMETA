const mongoose = require("mongoose");

const HealthDailySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true
    },

    steps: {
      type: Number,
      default: 0
    },

    sleepMinutes: {
      type: Number,
      default: null
    },

    avgHeartRate: {
      type: Number,
      default: null
    },

    source: {
      type: String,
      enum: ["SIMULATED", "GOOGLE_FIT", "APPLE_HEALTH"],
      default: "SIMULATED"
    }
  },
  { timestamps: true }
);

// One record per day per user
HealthDailySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HealthDaily", HealthDailySchema);
