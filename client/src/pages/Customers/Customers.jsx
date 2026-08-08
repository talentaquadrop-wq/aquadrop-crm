import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Navbar from "../../components/layout/Navbar/Navbar";
import { toast } from "react-toastify";
import { exportCustomersToExcel } from "../../utils/exportCustomerExcel";
import { exportCustomersToPDF } from "../../utils/exportCustomerPDF";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from "../../services/customerService";
import "./Customers.css";

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState(emptyCustomer);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    amcCustomers: 0,
    warrantyCustomers: 0,
    totalRevenue: 0,
  });

  // ================= Pagination =================
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;

  // --- Fetch Customers ---
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getCustomers();

      if (res.success) {
        setCustomers(res.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCustomerStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  // --- Keyboard (Escape) Listener for Modals ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setShowView(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Search & Filter Logic ---
  const filteredCustomers = useMemo(() => {
    const safeCustomers = Array.isArray(customers) ? customers : [];
    return safeCustomers.filter((cust) => {
      const matchSearch =
        cust.name?.toLowerCase().includes(search.toLowerCase()) ||
        cust.phone?.includes(search) ||
        cust.email?.toLowerCase().includes(search.toLowerCase()) ||
        cust.city?.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "All" ||
        (filter === "Active" && cust.status === "Active") ||
        (filter === "Inactive" && cust.status === "Inactive") ||
        (filter === "AMC" && cust.amc === true) ||
        (filter === "Warranty" && cust.warranty === "Active");
      return matchSearch && matchFilter;
    });
  }, [customers, search, filter]);

  // Pagination calculations using filteredCustomers
  const currentCustomersList = useMemo(() => {
    return filteredCustomers.slice(indexOfFirst, indexOfLast);
  }, [filteredCustomers, indexOfFirst, indexOfLast]);

  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
  );

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData(emptyCustomer);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setShowForm(true);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowView(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id || editingCustomer.id, formData);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(formData);
        toast.success("Customer added successfully");
      }

      fetchCustomers();
      fetchStats();
      setShowForm(false);
      setFormData(emptyCustomer);
      setEditingCustomer(null);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
        fetchStats();
        toast.success("Customer deleted");
      } catch (error) {
        console.error(error);
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="customers-container">
          {/* Header */}
          <div className="customers-header">
            <div className="header-left">
              <span className="page-tag">
                Aqua Drop CRM
              </span>
              <h1>Customers Management</h1>
              <p>
                View and manage all Aqua Drop customers.
              </p>
            </div>
            <div className="header-actions">
              <button
                className="excel-btn"
                onClick={() => exportCustomersToExcel(filteredCustomers)}
              >
                📊 Export Excel
              </button>
              <button
                className="pdf-btn"
                onClick={() => exportCustomersToPDF(filteredCustomers)}
              >
                📄 Export PDF
              </button>
              <button
                className="refresh-btn"
                onClick={() => {
                  fetchCustomers();
                  fetchStats();
                }}
              >
                🔄 Refresh
              </button>
              <button
                className="add-btn"
                onClick={handleAddNew}
              >
                ➕ Add Customer
              </button>
            </div>
          </div>

          <div className="customer-stats">
            <div className="customer-stat-card">
              <h2>{stats.totalCustomers}</h2>
              <p>Total Customers</p>
            </div>

            <div className="customer-stat-card">
              <h2>{stats.activeCustomers}</h2>
              <p>Active Customers</p>
            </div>

            <div className="customer-stat-card">
              <h2>{stats.amcCustomers}</h2>
              <p>AMC Customers</p>
            </div>

            <div className="customer-stat-card">
              <h2>{stats.warrantyCustomers}</h2>
              <p>Warranty Active</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="toolbar">
            <input
              type="text"
              className="search-box"
              placeholder="Search by Name, Phone, Email, or City..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
            />
          </div>

          <div className="customer-filters">
            <button
              className={filter === "All" ? "active-filter" : ""}
              onClick={() => {
                setFilter("All");
                setCurrentPage(1);
              }}
            >
              All
            </button>
            <button
              className={filter === "Active" ? "active-filter" : ""}
              onClick={() => {
                setFilter("Active");
                setCurrentPage(1);
              }}
            >
              Active
            </button>
            <button
              className={filter === "AMC" ? "active-filter" : ""}
              onClick={() => {
                setFilter("AMC");
                setCurrentPage(1);
              }}
            >
              AMC
            </button>
            <button
              className={filter === "Warranty" ? "active-filter" : ""}
              onClick={() => {
                setFilter("Warranty");
                setCurrentPage(1);
              }}
            >
              Warranty
            </button>
            <button
              className={filter === "Inactive" ? "active-filter" : ""}
              onClick={() => {
                setFilter("Inactive");
                setCurrentPage(1);
              }}
            >
              Inactive
            </button>
          </div>

          {/* Form Modal / Card */}
          {showForm && (
            <div className="form-modal-backdrop" onClick={() => setShowForm(false)}>
              <div className="form-card" onClick={(e) => e.stopPropagation()}>
                <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Customer Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="form-group">
                      <label>City / Location</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete installation address"
                      />
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      {editingCustomer ? "Update Customer" : "Save Customer"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Customers Data Table */}
          <div className="table-card">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Loading customers...
                    </td>
                  </tr>
                ) : currentCustomersList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No Customers Found
                    </td>
                  </tr>
                ) : (
                  currentCustomersList.map((cust, index) => (
                    <tr key={cust._id || cust.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {cust.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4>{cust.name}</h4>
                            <p>{cust.address || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td>{cust.phone}</td>
                      <td>{cust.city || "-"}</td>
                      <td>{cust.email || "-"}</td>
                      <td>
                        <span
                          className={`status ${
                            cust.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {cust.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: "center" }}>
                          <button
                            className="view-btn"
                            onClick={() => handleView(cust)}
                            title="View"
                          >
                            👁
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(cust)}
                            title="Edit"
                          >
                            ✏
                          </button>
                          <button
                            className="whatsapp-btn"
                            onClick={() =>
                              window.open(`https://wa.me/91${cust.phone}`)
                            }
                            title="WhatsApp"
                          >
                            💬
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(cust._id || cust.id, cust.name)
                            }
                            title="Delete"
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
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ⬅ Previous
              </button>
              <span>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next ➡
              </button>
            </div>
          </div>

          {/* View Details Modal */}
          {showView && selectedCustomer && (
            <div className="view-modal" onClick={() => setShowView(false)}>
              <div className="view-card" onClick={(e) => e.stopPropagation()}>
                <div className="view-header">
                  <h2>Customer Details</h2>
                  <button onClick={() => setShowView(false)}>✕</button>
                </div>
                <div className="profile-section">
                  <div className="profile-avatar">
                    {selectedCustomer.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3>{selectedCustomer.name}</h3>
                  <p>Active Customer</p>
                </div>
                <div className="detail-grid">
                  <div>
                    <label>Phone</label>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{selectedCustomer.email || "-"}</p>
                  </div>
                  <div>
                    <label>City</label>
                    <p>{selectedCustomer.city || "-"}</p>
                  </div>
                  <div>
                    <label>Address</label>
                    <p>{selectedCustomer.address || "-"}</p>
                  </div>
                  <div>
                    <label>AMC</label>
                    <p>{selectedCustomer.amc ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label>Warranty</label>
                    <p>{selectedCustomer.warranty || "-"}</p>
                  </div>
                </div>
                <div className="profile-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setShowView(false);
                      handleEdit(selectedCustomer);
                    }}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="whatsapp-btn"
                    onClick={() =>
                      window.open(`https://wa.me/91${selectedCustomer.phone}`)
                    }
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}