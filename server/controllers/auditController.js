const AuditLog = require("../models/AuditLog");

const listAuditLogs = async (req, res) => {
  try {
    if (!req.user || !["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Admin or Manager access required" });
    }
    const limit = Math.min(Number(req.query.limit) || 100, 250);
    const moduleName = req.query.module;
    const query = moduleName ? { module: moduleName } : {};
    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAuditLog = async ({ req, action, module, entityId = null, entityName = "", details = "" }) => {
  try {
    if (!req?.user) return;
    await AuditLog.create({ action, module, entityId, entityName, details, user: req.user._id, userName: req.user.name, userRole: req.user.role });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

module.exports = { listAuditLogs, createAuditLog };
