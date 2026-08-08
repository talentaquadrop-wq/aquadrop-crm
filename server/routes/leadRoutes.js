const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
} = require("../controllers/leadController");

router.get("/", protect, getLeads);

router.get("/:id", protect, getLeadById);

router.post("/", protect, createLead);

router.put("/:id", protect, updateLead);

router.delete("/:id", protect, deleteLead);

router.post("/:id/convert", protect, convertLeadToCustomer);
module.exports = router;