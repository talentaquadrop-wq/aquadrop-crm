const mongoose = require("mongoose");

const ivrConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      default: "",
      trim: true,
    },

    ivrNumber: {
      type: String,
      default: "",
      trim: true,
    },

    isConnected: {
      type: Boolean,
      default: false,
    },

    routingMode: {
      type: String,
      enum: [
        "Round Robin",
        "Simultaneous Ring",
        "Department Wise",
      ],
      default: "Round Robin",
    },

    selectedExecutives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IVRConfig",
  ivrConfigSchema
);