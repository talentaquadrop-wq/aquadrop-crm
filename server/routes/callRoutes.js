const express = require("express");

const router = express.Router();

const {
  getCalls,
  getCallById,
  createIncomingCall,
  updateCall,
} = require("../controllers/callController");

const {
  protect,
} = require("../middleware/authMiddleware");


// =========================================
// GET ALL CALLS
// =========================================

router.get(
  "/",
  protect,
  getCalls
);


// =========================================
// GET SINGLE CALL
// =========================================

router.get(
  "/:id",
  protect,
  getCallById
);


// =========================================
// CREATE INCOMING CALL
// =========================================

router.post(
  "/incoming",
  protect,
  createIncomingCall
);


// =========================================
// UPDATE CALL
// =========================================

router.put(
  "/:id",
  protect,
  updateCall
);


module.exports = router;