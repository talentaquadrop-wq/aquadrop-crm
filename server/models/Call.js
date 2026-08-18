const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    // Customer / Caller Details
    customerNumber: {
      type: String,
      required: true,
      trim: true,
    },

    customerName: {
      type: String,
      default: "",
      trim: true,
    },

    // Call Details
    direction: {
      type: String,
      enum: ["Incoming", "Outgoing"],
      default: "Incoming",
    },

    status: {
      type: String,
      enum: [
        "Ringing",
        "Answered",
        "Missed",
        "Busy",
        "Failed",
        "Completed",
      ],
      default: "Ringing",
    },

    // IVR Details
    provider: {
      type: String,
      default: "",
    },

    ivrNumber: {
      type: String,
      default: "",
    },

    // Executive Assignment
    assignedExecutive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Related Lead / Customer
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    // Call Timing
    startedAt: {
      type: Date,
      default: Date.now,
    },

    answeredAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },

    // Recording
    recordingUrl: {
      type: String,
      default: "",
    },

    // Provider Call ID
    providerCallId: {
      type: String,
      default: "",
      index: true,
    },

    // Additional Data
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Call",
  callSchema
);