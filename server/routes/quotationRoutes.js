const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
} = require("../controllers/quotationController");

// Get All
router.get("/", getQuotations);

// Get Single
router.get("/:id", getQuotationById);

// Create
router.post("/", createQuotation);

// Update
router.put("/:id", updateQuotation);

// Delete
router.delete("/:id", deleteQuotation);

// Update Status
router.patch("/:id/status", updateQuotationStatus);

module.exports = router;