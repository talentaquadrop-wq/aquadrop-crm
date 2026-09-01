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
  addFollowUp,
} = require("../controllers/leadController");

router.get("/", protect, getLeads);

router.get("/:id", protect, getLeadById);

router.post("/", protect, createLead);

router.put("/:id", protect, updateLead);

router.delete("/:id", protect, deleteLead);

router.post("/:id/convert", protect, convertLeadToCustomer);
router.post("/:id/follow-up", protect, addFollowUp);
module.exports = router;