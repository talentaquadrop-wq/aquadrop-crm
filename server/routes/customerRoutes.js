const express = require("express");

const router = express.Router();

const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} = require("../controllers/customerController");

router.get("/", getCustomers);

router.get("/stats", getCustomerStats);

router.post("/", addCustomer);

router.put("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

module.exports = router;