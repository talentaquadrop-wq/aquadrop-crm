const express = require("express");

console.log("Installation Routes File Loaded");

const router = express.Router();

const {
  createInstallation,
  getInstallations,
  getInstallationById,
  updateInstallation,
  deleteInstallation,
} = require("../controllers/installationController");

// Get All Installations
router.get("/", getInstallations);

// Get Single Installation
router.get("/:id", getInstallationById);

// Create Installation
router.post("/", createInstallation);

// Update Installation
router.put("/:id", updateInstallation);

// Delete Installation
router.delete("/:id", deleteInstallation);

module.exports = router;