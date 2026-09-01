const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true, min: 0.01 },
  method: { type: String, enum: ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"], default: "UPI" },
  reference: { type: String, default: "" },
  paymentDate: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
paymentSchema.index({ customer: 1, paymentDate: -1 });
module.exports = mongoose.model("Payment", paymentSchema);
