const express = require("express");

console.log("✅ Product Routes Loaded");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ===============================
// Debug Route
// ===============================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Product Route Working",
  });
});

// ===============================
// Get All Products
// ===============================
router.get("/", getProducts);

// ===============================
// Get Single Product
// ===============================
router.get("/:id", getProductById);

// ===============================
// Create Product
// ===============================
router.post("/", createProduct);

// ===============================
// Update Product
// ===============================
router.put("/:id", updateProduct);

// ===============================
// Delete Product
// ===============================
router.delete("/:id", deleteProduct);

module.exports = router;