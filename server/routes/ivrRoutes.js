const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getIVRConfig,
  saveIVRConfig,
  disconnectIVR,
} = require("../controllers/ivrController");


// =========================================
// GET IVR CONFIGURATION
// =========================================

router.get(
  "/",
  protect,
  getIVRConfig
);


// =========================================
// SAVE / UPDATE IVR CONFIGURATION
// =========================================

router.post(
  "/",
  protect,
  saveIVRConfig
);


// =========================================
// DISCONNECT IVR
// =========================================

router.put(
  "/disconnect",
  protect,
  disconnectIVR
);


module.exports = router;