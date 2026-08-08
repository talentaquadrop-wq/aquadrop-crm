const express = require("express");

const router = express.Router();

const {
  getReports,
} = require("../controllers/reportController");

// ===============================
// Reports
// ===============================

router.get("/", getReports);

module.exports = router;