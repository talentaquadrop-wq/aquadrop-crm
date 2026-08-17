import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { exportProductsExcel } from "../../utils/exportProductsExcel";
import { exportProductsPDF } from "../../utils/exportProductsPDF";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import "./Inventory.css";

const emptyProduct = {
  productName: "",
  category: "Filter",
  sku: "",
  brand: "",
  quantity: "",
  buyPrice: "",
  sellPrice: "",
  supplier: "",
  status: "In Stock",
  description: "",
};

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dashboardFilter, setDashboardFilter] = useState("All");

  // STEP-1: Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // =============================
  // Fetch Products
  // =============================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =============================
  // Search & Filters
  // =============================
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.productName?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.brand?.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesDashboard =
        dashboardFilter === "All" || item.status === dashboardFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDashboard
      );
    });
  }, [products, search, categoryFilter, statusFilter, dashboardFilter]);

  // STEP-2: Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // =============================
  // Handle Change
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // Add Product
  // =============================
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setShowForm(true);
  };

  // =============================
  // Edit Product
  // =============================
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      category: product.category,
      sku: product.sku,
      brand: product.brand,
      quantity: product.quantity,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      supplier: product.supplier,
      status: product.status,
      description: product.description,
    });
    setShowForm(true);
  };

  // =============================
  // Save Product
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let status = "In Stock";
      const qty = Number(formData.quantity);

      if (qty === 0) {
        status = "Out of Stock";
      } else if (qty <= 10) {
        status = "Low Stock";
      }

      const productData = {
        ...formData,
        status,
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success("Product Updated Successfully");
      } else {
        await createProduct(productData);
        toast.success("Product Added Successfully");
      }

      fetchProducts();
      setEditingProduct(null);
      setFormData(emptyProduct);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  // =============================
  // Delete Product
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Product?")) return;

    try {
      await deleteProduct(id);
      toast.success("Product Deleted");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Delete Failed");
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // =============================
  // Dashboard Cards Calculation
  // =============================
  const totalProducts = products.length;
  const inStock = products.filter((x) => x.status === "In Stock").length;
  const lowStock = products.filter((x) => x.status === "Low Stock").length;
  const outOfStock = products.filter((x) => x.status === "Out of Stock").length;

  return (
    <div className="inventory-container">
          <div className="inventory-header">
            <div>
              <h1>Inventory Management</h1>
              <p>Manage Aqua Drop Inventory</p>
            </div>

            <div className="header-actions">
              <button
                className="excel-btn"
                onClick={() => exportProductsExcel(products)}
              >
                📗 Export Excel
              </button>

              <button
                className="pdf-btn"
                onClick={() => exportProductsPDF(products)}
              >
                📕 Export PDF
              </button>

              <button className="refresh-btn" onClick={fetchProducts}>
                🔄 Refresh
              </button>

              <button className="add-btn" onClick={handleAddNew}>
                ➕ Add Product
              </button>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="stats-grid">
            <div
              className="stat-card"
              onClick={() => {
                setDashboardFilter("All");
                setCurrentPage(1);
              }}
            >
              <h2>{totalProducts}</h2>
              <p>Total Products</p>
            </div>

            <div
              className="stat-card"
              onClick={() => {
                setDashboardFilter("In Stock");
                setCurrentPage(1);
              }}
            >
              <h2>{inStock}</h2>
              <p>In Stock</p>
            </div>

            <div
              className="stat-card"
              onClick={() => {
                setDashboardFilter("Low Stock");
                setCurrentPage(1);
              }}
            >
              <h2>{lowStock}</h2>
              <p>Low Stock</p>
            </div>

            <div
              className="stat-card"
              onClick={() => {
                setDashboardFilter("Out of Stock");
                setCurrentPage(1);
              }}
            >
              <h2>{outOfStock}</h2>
              <p>Out Of Stock</p>
            </div>
          </div>

          {/* Toolbar / Search & Filters */}
          <div className="toolbar">
            <input
              type="text"
              className="search-box"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <select
              className="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              <option value="Filter">Filter</option>
              <option value="Water Softener">Water Softener</option>
              <option value="RO System">RO System</option>
              <option value="Spare Part">Spare Part</option>
              <option value="Accessory">Accessory</option>
            </select>

            <select
              className="category-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="form-card">
              <h2>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>Filter</option>
                      <option>Water Softener</option>
                      <option>RO System</option>
                      <option>Spare Part</option>
                      <option>Accessory</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>SKU Code</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Buying Price</label>
                    <input
                      type="number"
                      name="buyPrice"
                      value={formData.buyPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Selling Price</label>
                    <input
                      type="number"
                      name="sellPrice"
                      value={formData.sellPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingProduct ? "Update Product" : "Save Product"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      setFormData(emptyProduct);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="table-card">
            <table className="service-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Buying</th>
                  <th>Selling</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="no-data">
                      Loading...
                    </td>
                  </tr>
                ) : currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="no-data">
                      No Products Found
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td>{indexOfFirstProduct + index + 1}</td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td>{product.sku}</td>
                      <td>{product.brand}</td>
                      <td>{product.quantity}</td>
                      <td>₹ {product.buyPrice}</td>
                      <td>₹ {product.sellPrice}</td>
                      <td>{product.supplier}</td>
                      <td>
                        <span
                          className={`status ${product.status
                            .replace(/\s/g, "")
                            .toLowerCase()}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                       <div className="action-buttons">

  <button
    className="view-btn"
    title="View Product"
    onClick={() => handleView(product)}
  >
    👁
  </button>

  <button
    className="edit-btn"
    title="Edit Product"
    onClick={() => handleEdit(product)}
  >
    ✏
  </button>

  <button
    className="delete-btn"
    title="Delete Product"
    onClick={() => handleDelete(product._id)}
  >
    🗑
  </button>

</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ◀ Previous
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={
                  currentPage === totalPages || totalPages === 0
                }
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>
    </div>
  );
}