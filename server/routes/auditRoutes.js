const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { listAuditLogs } = require("../controllers/auditController");
router.get("/", protect, authorize("Admin", "Manager"), listAuditLogs);
module.exports = router;
