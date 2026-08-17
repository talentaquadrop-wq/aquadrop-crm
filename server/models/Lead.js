const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // Customer Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    // Address
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // Water Details
    tds: {
      type: Number,
      default: 0,
    },

    waterSource: {
      type: String,
      enum: ["Bore Water", "Municipal", "Mixed", "Other"],
      default: "Other",
    },

    familyMembers: {
      type: Number,
      default: 0,
    },

    // Lead Details
    source: {
      type: String,
      enum: [
        "Website",
        "YouTube",
        "Facebook",
        "Instagram",
        "Google Ads",
        "WhatsApp",
        "Referral",
        "Walk-in",
        "Phone Call",
        "IndiaMART",
        "Dealer",
        "Exhibition",
        "Other",
      ],
      default: "Website",
    },

    product: {
      type: String,
      default: "",
    },

    budget: {
      type: Number,
      default: 0,
    },

    // Lead Status
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Follow-up",
        "Interested",
        "Site Visit Scheduled",
        "Site Visit Completed",
        "Quotation Sent",
        "Negotiation",
        "Won",
        "Lost",
      ],
      default: "New",
    },

    // 🔔 FOLLOW-UP SYSTEM
    nextFollowUpDate: {
      type: Date,
      default: null,
    },

    followUpStatus: {
      type: String,
      enum: ["Pending", "Completed", "Rescheduled"],
      default: "Pending",
    },

    followUpNotes: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTelecaller: {
      type: String,
      default: "",
    },

    assignedAgent: {
      type: String,
      default: "",
    },

    // Follow-up
    followUpDate: {
      type: Date,
    },

    lastFollowUp: {
      type: Date,
    },

    siteVisitRequired: {
      type: Boolean,
      default: false,
    },

    // Notes
    remarks: {
      type: String,
      default: "",
    },

    isConverted: {
      type: Boolean,
      default: false,
    },

    convertedCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    convertedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);