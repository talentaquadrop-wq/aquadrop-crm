import React, { useEffect, useMemo, useState } from "react";
import "./Installations.css";

import {
  getInstallations,
  createInstallation,
  updateInstallation,
  deleteInstallation,
} from "../../services/installationService";

import { toast } from "react-toastify";

const emptyInstallation = {
  customer: "",
  phone: "",
  address: "",
  product: "",
  technician: "",
  installationDate: "",
  status: "Pending",
  notes: "",
};

export default function Installations() {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [formData, setFormData] = useState(emptyInstallation);

  // Helper to extract installation ID regardless of schema (_id vs id)
  const getInstallationId = (installation) =>
    installation?._id || installation?.id;

  // --- API Fetch ---
  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const res = await getInstallations();
      setInstallations(res.data || []);
    } catch (error) {
      toast.error("Failed to load Installations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  // --- Filtering ---
  const filteredInstallations = useMemo(() => {
    return installations.filter((installation) => {
      const matchesSearch =
        installation.customer?.toLowerCase().includes(search.toLowerCase()) ||
        installation.phone?.includes(search) ||
        installation.product?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        activeStatus === "All" || installation.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [installations, search, activeStatus]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingInstallation(null);
    setFormData(emptyInstallation);
    setShowForm(true);
  };

  const handleEdit = (installation) => {
    setEditingInstallation(installation);
    setFormData({
      ...emptyInstallation,
      ...installation,
      installationDate: installation.installationDate
        ? installation.installationDate.substring(0, 10)
        : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const targetId = getInstallationId(editingInstallation);

      if (editingInstallation && targetId) {
        await updateInstallation(targetId, formData);
        toast.success("Installation Updated Successfully");
      } else {
        await createInstallation(formData);
        toast.success("Installation Created Successfully");
      }

      await fetchInstallations();
      setFormData(emptyInstallation);
      setEditingInstallation(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateInstallation(id, { status });
      toast.success("Status Updated");
      fetchInstallations();
    } catch (error) {
      toast.error("Status Update Failed");
    }
  };

  const handleDelete = async (id, name = "this installation") => {
    if (!id) {
      toast.error("Invalid Installation ID");
      return;
    }

    const confirmed = window.confirm(`Delete ${name}?`);
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteInstallation(id);

      setInstallations((prev) =>
        prev.filter((item) => getInstallationId(item) !== id)
      );
      toast.success("Installation Deleted");

      if (selectedInstallation && getInstallationId(selectedInstallation) === id) {
        setSelectedInstallation(null);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete Failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (installation) => {
    setSelectedInstallation(installation);
  };

  const closePopup = () => {
    setSelectedInstallation(null);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="installations-container">
          {/* Header */}
          <div className="installations-header">
            <div>
              <h1>Installation Management</h1>
              <p>Manage all Aqua Drop customer installations</p>
            </div>

            <button className="add-btn" onClick={handleAddNew}>
              + New Installation
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <h2>{installations.length}</h2>
              <p>Total Installations</p>
            </div>

            <div className="stat-card">
              <h2>
                {installations.filter((i) => i.status === "Pending").length}
              </h2>
              <p>Pending</p>
            </div>

            <div className="stat-card">
              <h2>
                {installations.filter((i) => i.status === "Scheduled").length}
              </h2>
              <p>Scheduled</p>
            </div>

            <div className="stat-card">
              <h2>
                {installations.filter((i) => i.status === "Completed").length}
              </h2>
              <p>Completed</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="toolbar">
            <input
              className="search-box"
              placeholder="Search Customer / Phone / Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="status-filters">
            {["All", "Pending", "Scheduled", "Completed"].map((status) => (
              <button
                key={status}
                className={activeStatus === status ? "active-filter" : ""}
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Form */}
          {showForm && (
            <div className="form-card">
              <h2>
                {editingInstallation
                  ? "Edit Installation"
                  : "New Installation"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Product *</label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Assigned Technician *</label>
                    <select
                      name="technician"
                      value={formData.technician}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Technician</option>
                      <option value="Mahesh">Mahesh</option>
                      <option value="Ramesh">Ramesh</option>
                      <option value="Suresh">Suresh</option>
                      <option value="Naresh">Naresh</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Installation Date *</label>
                    <input
                      type="date"
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      rows="4"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingInstallation
                      ? "Update Installation"
                      : "Save Installation"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingInstallation(null);
                      setFormData(emptyInstallation);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Grid */}
          <div className="table-card">
            <table className="installation-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Technician</th>
                  <th>Installation Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstallations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                      }}
                    >
                      No Installations Found
                    </td>
                  </tr>
                ) : (
                  filteredInstallations.map((installation) => {
                    const installationId = getInstallationId(installation);
                    return (
                      <tr key={installationId}>
                        <td>{installation.customer}</td>
                        <td>{installation.phone}</td>
                        <td>{installation.product}</td>
                        <td>{installation.technician}</td>
                        <td>{installation.installationDate}</td>
                        <td>
                          <select
                            className={`status ${installation.status}`}
                            value={installation.status}
                            onChange={(e) =>
                              handleStatusChange(installationId, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => handleView(installation)}
                            >
                              View
                            </button>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(installation)}
                            >
                              Edit
                            </button>
                            <button
                              className="complete-btn"
                              onClick={() =>
                                handleStatusChange(installationId, "Completed")
                              }
                            >
                              Complete
                            </button>
                            <button
                              className="delete-btn"
                              disabled={deletingId === installationId}
                              onClick={() =>
                                handleDelete(installationId, installation.customer)
                              }
                            >
                              {deletingId === installationId
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Popup Modal */}
          {selectedInstallation && (
            <div className="popup-overlay">
              <div className="popup-card">
                <h2>Installation Details</h2>
                <p>
                  <strong>Customer :</strong> {selectedInstallation.customer}
                </p>
                <p>
                  <strong>Phone :</strong> {selectedInstallation.phone}
                </p>
                <p>
                  <strong>Address :</strong> {selectedInstallation.address}
                </p>
                <p>
                  <strong>Product :</strong> {selectedInstallation.product}
                </p>
                <p>
                  <strong>Technician :</strong> {selectedInstallation.technician}
                </p>
                <p>
                  <strong>Date :</strong> {selectedInstallation.installationDate}
                </p>
                <p>
                  <strong>Status :</strong> {selectedInstallation.status}
                </p>
                <p>
                  <strong>Notes :</strong> {selectedInstallation.notes}
                </p>

                <div className="popup-actions" style={{ marginTop: "20px" }}>
                  <button className="save-btn" onClick={closePopup}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}