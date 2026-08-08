const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Installed Product
    product: {
      type: String,
      default: "",
    },

    // AMC Status
    amc: {
      type: Boolean,
      default: false,
    },

    // Warranty
    warranty: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },

    // Installation Date
    installationDate: {
      type: Date,
    },

    // Technician
    technician: {
      type: String,
      default: "",
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    // Total Amount
    amount: {
      type: Number,
      default: 0,
    },

    // Notes
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);