import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./Leads.css";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Navbar from "../../components/layout/Navbar/Navbar";
import { exportLeadsToExcel } from "../../utils/exportExcel";
import { exportLeadsToPDF } from "../../utils/exportPDF";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
} from "../../services/leadService";
import { getExecutives } from "../../services/employeeService";

import { toast } from "react-toastify";

const emptyLead = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  tds: "",
  waterSource: "Bore Water",
  product: "",
  budget: "",
  status: "New",
  priority: "Medium",
  assignedTo: "",
  followUpDate: "",
  remarks: "",
};

export default function Leads() {
  // Safe extraction of current user from localStorage
  const currentUser = useMemo(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse local user", e);
      return null;
    }
  }, []);

  // --- Step 1: Role-Based Flags ---
  const isAdmin =
    currentUser?.role === "Admin" || currentUser?.role === "Manager";
  const isExecutive = currentUser?.role === "Executive";

  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [formData, setFormData] = useState(emptyLead);

  const getLeadId = (lead) => lead?._id || lead?.id;

  // --- API Fetch ---
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getLeads();
      setLeads(res.data || []);
    } catch (error) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExecutives = useCallback(async () => {
    try {
      const res = await getExecutives();
      setExecutives(res.data || []);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    if (isAdmin) {
      fetchExecutives();
    }
  }, [fetchLeads, fetchExecutives, isAdmin]);

  // --- Filtering ---
  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        (lead.name || "").toLowerCase().includes(query) ||
        (lead.phone || "").includes(query) ||
        (lead.city || "").toLowerCase().includes(query) ||
        (lead.email || "").toLowerCase().includes(query);

      const matchesStatus =
        activeStatus === "All" || lead.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, activeStatus]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setFormData({
      ...emptyLead,
      assignedTo: !isAdmin ? currentUser?._id || currentUser?.id || "" : "",
    });
    setShowForm(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);

    const sanitizedLead = Object.keys(emptyLead).reduce((acc, key) => {
      acc[key] = lead[key] ?? emptyLead[key];
      return acc;
    }, {});

    let formattedDate = "";
    if (lead.followUpDate) {
      formattedDate = new Date(lead.followUpDate).toISOString().split("T")[0];
    }

    setFormData({
      ...sanitizedLead,
      assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
      followUpDate: formattedDate,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdmin && !formData.assignedTo) {
      toast.error("Please select an employee to assign this lead");
      return;
    }

    try {
      const payload = {
        ...formData,
        tds: formData.tds ? Number(formData.tds) : null,
        budget: formData.budget ? Number(formData.budget) : null,
      };

      const targetId = getLeadId(editingLead);

      if (editingLead && targetId) {
        await updateLead(targetId, payload);
        toast.success("Lead Updated Successfully");
      } else {
        await createLead(payload);
        toast.success("Lead Created Successfully");
      }

      await fetchLeads();
      setFormData(emptyLead);
      setEditingLead(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error?.response?.data?.message || "Operation Failed");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLead(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);

      if (newStatus === "Won" && isAdmin) {
        await handleConvert(id);
      } else {
        await fetchLeads();
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, leadName = "this lead") => {
    if (!id) {
      toast.error("Invalid Lead ID");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${leadName}?`)) return;

    try {
      setDeletingId(id);
      await deleteLead(id);

      setLeads((prevLeads) =>
        prevLeads.filter((lead) => getLeadId(lead) !== id)
      );
      toast.success("Lead Deleted Successfully");

      if (selectedLead && getLeadId(selectedLead) === id) {
        setSelectedLead(null);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  const handleConvert = async (id) => {
    try {
      await convertLead(id);
      toast.success("Lead Converted & Customer Created!");
      await fetchLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Conversion Failed");
    }
  };

  const sendWhatsApp = (lead) => {
    const sanitizedPhone = (lead.phone || "").replace(/\D/g, "");
    const phone = sanitizedPhone.startsWith("91") ? sanitizedPhone : `91${sanitizedPhone}`;
    const message = `Hello ${lead.name},\n\nThank you for contacting Aqua Drop.\n\nWe received your enquiry regarding ${lead.product || "our water purifier"}.\n\nOur team will contact you shortly.\n\nThank you,\nAqua Drop CRM`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="leads-header">
          <div>
            <h1>Leads Management</h1>
            <p>Manage all Aqua Drop customer leads</p>
          </div>

          <div className="header-actions">
            <button className="excel-btn" onClick={() => exportLeadsToExcel(filteredLeads)}>
              📊 Export Excel
            </button>
            <button className="pdf-btn" onClick={() => exportLeadsToPDF(filteredLeads)}>
              📄 Export PDF
            </button>
            <button className="refresh-btn" onClick={fetchLeads}>
              🔄 Refresh
            </button>
            
            {/* Step 2: Hide Add Lead for Non-Admins */}
            {isAdmin && (
              <button className="add-btn" onClick={handleAddNew}>
                + Add Lead
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{leads.length}</h2>
            <p>Total Leads</p>
          </div>
          <div className="stat-card">
            <h2>{leads.filter((l) => l.status === "New").length}</h2>
            <p>New Leads</p>
          </div>
          <div className="stat-card">
            <h2>{leads.filter((l) => l.status === "Won").length}</h2>
            <p>Won Leads</p>
          </div>
          <div className="stat-card">
            <h2>{leads.filter((l) => l.followUpDate).length}</h2>
            <p>Follow Ups</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="toolbar">
          <input
            className="search-box"
            placeholder="Search by Name / Phone / City"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filters">
          {["All", "New", "Contacted", "Interested", "Won", "Lost"].map((status) => (
            <button
              key={status}
              className={activeStatus === status ? "active-filter" : ""}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="form-card">
            <h2>{editingLead ? "Edit Lead" : "Add New Lead"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Water TDS</label>
                  <input
                    type="number"
                    name="tds"
                    value={formData.tds}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Water Source</label>
                  <select
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleChange}
                  >
                    <option value="Bore Water">Bore Water</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Product</label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Site Visit Completed">Site Visit Completed</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {isAdmin && (
                  <div className="form-group">
                    <label>Assigned To *</label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Employee</option>
                      {executives.map((emp) => (
                        <option key={emp._id || emp.id} value={emp._id || emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Follow Up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Remarks</label>
                  <textarea
                    rows="4"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  {editingLead ? "Update Lead" : "Save Lead"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLead(null);
                    setFormData(emptyLead);
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
          <table className="lead-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>City</th>
                <th>Product</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No Leads Found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const leadId = getLeadId(lead);
                  return (
                    <tr key={leadId}>
                      <td>{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.city || "-"}</td>
                      <td>{lead.product || "-"}</td>

                      <td>
                        <select
                          className={`status ${lead.status}`}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(leadId, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Interested">Interested</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td>
                        <span className={`priority ${lead.priority}`}>
                          {lead.priority}
                        </span>
                      </td>

                      <td>{lead.assignedTo?.name || "-"}</td>

                      <td>
                        <div className="action-buttons">
                          <button className="view-btn" onClick={() => setSelectedLead(lead)}>
                            View
                          </button>

                          <button className="edit-btn" onClick={() => handleEdit(lead)}>
                            Edit
                          </button>

                          <button className="whatsapp-btn" onClick={() => sendWhatsApp(lead)}>
                            WhatsApp
                          </button>

                          {/* Step 4: Hide Convert Button for Non-Admins */}
                          {isAdmin && !lead.isConverted && lead.status === "Won" && (
                            <button className="convert-btn" onClick={() => handleConvert(leadId)}>
                              Convert
                            </button>
                          )}

                          {lead.isConverted && (
                            <span className="converted-badge">Converted</span>
                          )}

                          {/* Step 3: Hide Delete Button for Non-Admins */}
                          {isAdmin && (
                            <button
                              className="delete-btn"
                              disabled={deletingId === leadId}
                              onClick={() => handleDelete(leadId, lead.name)}
                            >
                              {deletingId === leadId ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Popup Modal */}
        {selectedLead && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h2>Lead Details</h2>
              <p><strong>Name :</strong> {selectedLead.name}</p>
              <p><strong>Phone :</strong> {selectedLead.phone}</p>
              <p><strong>Email :</strong> {selectedLead.email}</p>
              <p><strong>City :</strong> {selectedLead.city}</p>
              <p><strong>Address :</strong> {selectedLead.address}</p>
              <p><strong>Product :</strong> {selectedLead.product}</p>
              <p><strong>Status :</strong> {selectedLead.status}</p>
              <p><strong>Priority :</strong> {selectedLead.priority}</p>
              <p><strong>Assigned To :</strong> {selectedLead.assignedTo?.name || "-"}</p>
              <p><strong>Remarks :</strong> {selectedLead.remarks}</p>

              <div className="popup-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button className="save-btn" onClick={() => setSelectedLead(null)}>
                  Close
                </button>
                {isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(getLeadId(selectedLead), selectedLead.name)}
                  >
                    Delete Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}