const express = require("express");

const router = express.Router();

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Get All Services
router.get("/", getServices);

// Get Single Service
router.get("/:id", getServiceById);

// Create Service
router.post("/", createService);

// Update Service
router.put("/:id", updateService);

// Delete Service
router.delete("/:id", deleteService);

module.exports = router;