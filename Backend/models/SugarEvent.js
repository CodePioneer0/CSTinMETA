const mongoose = require("mongoose");

const SugarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    itemType: {
      type: String,
      required: true,
      enum: [
        "CHAI",
        "COFFEE",
        "SWEETS",
        "COLD_DRINK",
        "PACKAGED_SNACK",
        "ICE_CREAM",
        "CHOCOLATE",
        "JUICE",
        "OTHER"
      ]
    },

    quantity: {
      type: Number,
      default: 1
    },

    estimatedSugarGrams: {
      type: Number,
      default: null
    },

    timestamp: {
      type: Date,
      required: true
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true
    },

    imageUrl: {
      type: String,
      default: null
    },

    timeOfDay: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "EVENING", "NIGHT"],
      required: true
    }
  },
  { timestamps: true }
);

SugarEventSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("SugarEvent", SugarEventSchema);
