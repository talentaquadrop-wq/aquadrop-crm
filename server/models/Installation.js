const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    product: {
      type: String,
      required: true,
    },

    technician: {
      type: String,
      required: true,
    },

    installationDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Installation", installationSchema);