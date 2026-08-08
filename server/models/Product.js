const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Water Softener",
        "RO System",
        "Filter",
        "Spare Part",
        "Accessory",
      ],
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    buyPrice: {
      type: Number,
      required: true,
    },

    sellPrice: {
      type: Number,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "In Stock",
        "Low Stock",
        "Out of Stock",
      ],
      default: "In Stock",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);