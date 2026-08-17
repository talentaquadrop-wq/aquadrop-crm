import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";

import { exportCustomersToExcel } from "../../utils/exportCustomerExcel";
import { exportCustomersToPDF } from "../../utils/exportCustomerPDF";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from "../../services/CustomerService";

import "./Customers.css";

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  status: "Active",
  amc: false,
  warranty: "Inactive",
};

export default function Customers() {
  // ===============================
  // STATE
  // ===============================

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

  // ===============================
  // PAGINATION
  // ===============================

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 10;

  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;

  // ===============================
  // FETCH CUSTOMERS
  // ===============================

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getCustomers();

      if (res?.success) {
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

  // ===============================
  // FETCH STATS
  // ===============================

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCustomerStats();

      if (res?.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  // ===============================
  // ESCAPE KEY
  // ===============================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setShowView(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ===============================
  // SEARCH + FILTER
  // ===============================

  const filteredCustomers = useMemo(() => {
    const safeCustomers = Array.isArray(customers)
      ? customers
      : [];

    return safeCustomers.filter((cust) => {
      const matchSearch =
        cust.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        cust.phone?.includes(search) ||
        cust.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        cust.city
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchFilter =
        filter === "All" ||
        (filter === "Active" &&
          cust.status === "Active") ||
        (filter === "Inactive" &&
          cust.status === "Inactive") ||
        (filter === "AMC" &&
          cust.amc === true) ||
        (filter === "Warranty" &&
          cust.warranty === "Active");

      return matchSearch && matchFilter;
    });
  }, [customers, search, filter]);

  // ===============================
  // CURRENT PAGE DATA
  // ===============================

  const currentCustomersList = useMemo(() => {
    return filteredCustomers.slice(
      indexOfFirst,
      indexOfLast
    );
  }, [
    filteredCustomers,
    indexOfFirst,
    indexOfLast,
  ]);

  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
  );

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===============================
  // WHATSAPP
  // ===============================

  const openWhatsApp = (phone) => {
    if (!phone) return;

    const cleanPhone = phone.replace(/\D/g, "");

    const formattedPhone = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone}`;

    window.open(
      `https://wa.me/${formattedPhone}`,
      "_blank"
    );
  };

  // ===============================
  // ADD CUSTOMER
  // ===============================

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData(emptyCustomer);
    setShowForm(true);
  };

  // ===============================
  // EDIT CUSTOMER
  // ===============================

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      ...emptyCustomer,
      ...customer,
    });

    setShowForm(true);
  };

  // ===============================
  // VIEW CUSTOMER
  // ===============================

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowView(true);
  };

  // ===============================
  // SAVE / UPDATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomer(
          editingCustomer._id ||
            editingCustomer.id,
          formData
        );

        toast.success(
          "Customer updated successfully"
        );
      } else {
        await createCustomer(formData);

        toast.success(
          "Customer added successfully"
        );
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

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}?`
      )
    ) {
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

  // ===============================
  // RETURN
  // ===============================

  return (
    <div className="customers-container">

      {/* =================================
          HEADER
      ================================= */}

      <div className="customers-header">

        <div className="header-left">

          <span className="page-tag">
            Aqua Drop CRM
          </span>

          <h1>
            Customers Management
          </h1>

          <p>
            View and manage all Aqua Drop
            customers.
          </p>

        </div>

        <div className="header-actions">

          <button
            className="excel-btn"
            onClick={() =>
              exportCustomersToExcel(
                filteredCustomers
              )
            }
          >
            📊 Export Excel
          </button>

          <button
            className="pdf-btn"
            onClick={() =>
              exportCustomersToPDF(
                filteredCustomers
              )
            }
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

      {/* =================================
          CUSTOMER STATS
      ================================= */}

      <div className="customer-stats">

        <div className="customer-stat-card">
          <h2>
            {stats.totalCustomers}
          </h2>
          <p>Total Customers</p>
        </div>

        <div className="customer-stat-card">
          <h2>
            {stats.activeCustomers}
          </h2>
          <p>Active Customers</p>
        </div>

        <div className="customer-stat-card">
          <h2>
            {stats.amcCustomers}
          </h2>
          <p>AMC Customers</p>
        </div>

        <div className="customer-stat-card">
          <h2>
            {stats.warrantyCustomers}
          </h2>
          <p>Warranty Active</p>
        </div>

      </div>

      {/* =================================
          SEARCH
      ================================= */}

      <div className="toolbar">

        <input
          type="text"
          className="search-box"
          placeholder="Search by Name, Phone, Email, or City..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

      </div>

      {/* =================================
          FILTERS
      ================================= */}

      <div className="customer-filters">

        {[
          "All",
          "Active",
          "AMC",
          "Warranty",
          "Inactive",
        ].map((f) => (
          <button
            key={f}
            className={
              filter === f
                ? "active-filter"
                : ""
            }
            onClick={() => {
              setFilter(f);
              setCurrentPage(1);
            }}
          >
            {f}
          </button>
        ))}

      </div>

      {/* =================================
          ADD / EDIT CUSTOMER MODAL
      ================================= */}

      {showForm && (
        <div
          className="form-modal-backdrop"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="form-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              {editingCustomer
                ? "Edit Customer"
                : "Add New Customer"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* NAME */}

                <div className="form-group">

                  <label>
                    Customer Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />

                </div>

                {/* CITY */}

                <div className="form-group">

                  <label>
                    City / Location
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                {/* WARRANTY */}

                <div className="form-group">

                  <label>
                    Warranty Status
                  </label>

                  <select
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                {/* AMC */}

                <div className="form-group full-width">

                  <label>

                    <input
                      type="checkbox"
                      name="amc"
                      checked={formData.amc}
                      onChange={handleChange}
                    />

                    {" "}
                    AMC Subscribed

                  </label>

                </div>

                {/* ADDRESS */}

                <div className="form-group full-width">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete installation address"
                  />

                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="form-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingCustomer
                    ? "Update Customer"
                    : "Save Customer"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================
          CUSTOMERS TABLE
      ================================= */}

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
              <th
                style={{
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="7"
                  className="no-data"
                >
                  Loading customers...
                </td>

              </tr>

            ) : currentCustomersList.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="no-data"
                >
                  No Customers Found
                </td>

              </tr>

            ) : (

              currentCustomersList.map(
                (cust, index) => (

                  <tr
                    key={
                      cust._id ||
                      cust.id
                    }
                  >

                    <td>
                      {indexOfFirst + index + 1}
                    </td>

                    {/* CUSTOMER */}

                    <td>

                      <div className="customer-info">

                        <div className="customer-avatar">

                          {cust.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <h4>
                            {cust.name}
                          </h4>

                          <p>
                            {cust.address || "-"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PHONE */}

                    <td>
                      {cust.phone}
                    </td>

                    {/* CITY */}

                    <td>
                      {cust.city || "-"}
                    </td>

                    {/* EMAIL */}

                    <td>
                      {cust.email || "-"}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status ${
                          cust.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {cust.status ||
                          "Active"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div
                        className="action-buttons"
                        style={{
                          justifyContent:
                            "center",
                        }}
                      >

                        {/* VIEW */}

                        <button
                          className="view-btn"
                          onClick={() =>
                            handleView(cust)
                          }
                          title="View"
                        >
                          👁
                        </button>

                        {/* EDIT */}

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(cust)
                          }
                          title="Edit"
                        >
                          ✏
                        </button>

                        {/* WHATSAPP */}

                        <button
                          className="whatsapp-btn"
                          onClick={() =>
                            openWhatsApp(
                              cust.phone
                            )
                          }
                          title="WhatsApp"
                        >
                          💬
                        </button>

                        {/* DELETE */}

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              cust._id ||
                                cust.id,
                              cust.name
                            )
                          }
                          title="Delete"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

        {/* =================================
            PAGINATION
        ================================= */}

        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            ⬅ Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {totalPages || 1}
          </span>

          <button
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next ➡
          </button>

        </div>

      </div>

      {/* =================================
          VIEW CUSTOMER MODAL
      ================================= */}

      {showView &&
        selectedCustomer && (

          <div
            className="view-modal"
            onClick={() =>
              setShowView(false)
            }
          >

            <div
              className="view-card"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="view-header">

                <h2>
                  Customer Details
                </h2>

                <button
                  onClick={() =>
                    setShowView(false)
                  }
                >
                  ✕
                </button>

              </div>

              {/* PROFILE */}

              <div className="profile-section">

                <div className="profile-avatar">

                  {selectedCustomer.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <h3>
                  {selectedCustomer.name}
                </h3>

                <p>
                  {selectedCustomer.status ||
                    "Active"}{" "}
                  Customer
                </p>

              </div>

              {/* DETAILS */}

              <div className="detail-grid">

                <div>

                  <label>
                    Phone
                  </label>

                  <p>
                    {selectedCustomer.phone}
                  </p>

                </div>

                <div>

                  <label>
                    Email
                  </label>

                  <p>
                    {selectedCustomer.email ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    City
                  </label>

                  <p>
                    {selectedCustomer.city ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    Address
                  </label>

                  <p>
                    {selectedCustomer.address ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    AMC
                  </label>

                  <p>
                    {selectedCustomer.amc
                      ? "Yes"
                      : "No"}
                  </p>

                </div>

                <div>

                  <label>
                    Warranty
                  </label>

                  <p>
                    {selectedCustomer.warranty ||
                      "-"}
                  </p>

                </div>

              </div>

              {/* PROFILE ACTIONS */}

              <div className="profile-actions">

                <button
                  className="edit-btn"
                  onClick={() => {
                    setShowView(false);
                    handleEdit(
                      selectedCustomer
                    );
                  }}
                >
                  ✏ Edit
                </button>

                <button
                  className="whatsapp-btn"
                  onClick={() =>
                    openWhatsApp(
                      selectedCustomer.phone
                    )
                  }
                >
                  💬 WhatsApp
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}