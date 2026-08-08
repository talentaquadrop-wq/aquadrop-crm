const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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

    serviceType: {
      type: String,
      required: true,
      enum: [
        "General Service",
        "Filter Replacement",
        "Repair",
        "Maintenance",
        "Installation Follow-up",
      ],
    },

    problem: {
      type: String,
      required: true,
    },

    technician: {
      type: String,
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);