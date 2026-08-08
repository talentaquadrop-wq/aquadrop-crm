const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getExecutives,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");

// Middleware to allow only Admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// ===============================
// Employee Routes
// ===============================

// Get all employees (Admin)
router.get("/", protect, adminOnly, getAllEmployees);

// Get executives list (For Lead Assignment)
// Any logged-in user can access this
router.get("/executives", protect, getExecutives);

// Create Employee
router.post("/", protect, adminOnly, createEmployee);

// Update Employee
router.put("/:id", protect, adminOnly, updateEmployee);

// Activate / Deactivate Employee
router.patch("/:id/status", protect, adminOnly, toggleEmployeeStatus);

// Reset Employee Password
router.patch("/:id/reset-password", protect, adminOnly, resetEmployeePassword);

// Delete Employee
router.delete("/:id", protect, adminOnly, deleteEmployee);

module.exports = router;