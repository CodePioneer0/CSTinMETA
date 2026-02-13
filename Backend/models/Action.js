const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
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
      index: true
    },

    actionType: {
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

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "EXPIRED"],
      default: "PENDING"
    },

    suggestedAt: {
      type: Date,
      required: true
    },

    completedAt: {
      type: Date,
      default: null
    },

    completedWithin30Min: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

ActionSchema.index({ userId: 1, sugarEventId: 1 });

module.exports = mongoose.model("Action", ActionSchema);
