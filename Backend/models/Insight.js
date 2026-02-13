const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    sugarEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SugarEvent",
      required: true,
      unique: true
    },

    riskTag: {
      type: String,
      enum: [
        "SLEEP_DISRUPTION",
        "ENERGY_CRASH",
        "DEHYDRATION_RISK",
        "WEIGHT_GAIN_RISK",
        "HIGH_SUGAR_HABIT"
      ],
      required: true
    },

    riskScore: {
      type: Number,
      required: true
    },

    insightText: {
      type: String,
      required: true
    },

    suggestedAction: {
      type: String,
      enum: [
        "DRINK_WATER",
        "10_MIN_WALK",
        "PROTEIN_SWAP",
        "STOP_MORE_SUGAR",
        "EAT_FRUIT"
      ],
      required: true
    },

    explanation: {
      type: String,
      required: true
    },

    modelVersion: {
      type: String,
      default: "v1"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insight", InsightSchema);
