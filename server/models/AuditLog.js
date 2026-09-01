const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true },
  module: { type: String, required: true, trim: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
  entityName: { type: String, default: "" },
  details: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  userName: { type: String, default: "" },
  userRole: { type: String, default: "" },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
