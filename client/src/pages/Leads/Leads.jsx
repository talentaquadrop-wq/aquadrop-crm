import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import "./Leads.css";

import { exportLeadsToExcel } from "../../utils/exportExcel";
import { exportLeadsToPDF } from "../../utils/exportPDF";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
  addFollowUp,
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

const LEAD_STATUSES = [
  "New", "Contacted", "Interested", "Follow Up",
  "Site Visit Scheduled", "Site Visit Completed",
  "Quotation Sent", "Negotiation", "Won", "Lost",
];

const STATUS_CLASS = (status = "") =>
  status.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Leads() {
  const currentUser = useMemo(() => {
    try {
      const user = localStorage.getItem("user");

      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse local user:", error);
      return null;
    }
  }, []);

  const isAdmin =
    currentUser?.role === "Admin" ||
    currentUser?.role === "Manager";

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
  const [viewMode, setViewMode] = useState("list");
  const [followUpLead, setFollowUpLead] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: "", notes: "" });

  const getLeadId = (lead) => lead?._id || lead?.id;

  // ==============================
  // FETCH LEADS
  // ==============================

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getLeads();

      setLeads(res.data || []);
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // FETCH EMPLOYEES
  // ==============================

  const fetchExecutives = useCallback(async () => {
    try {
      const res = await getExecutives();

      setExecutives(res.data || []);
    } catch (error) {
      console.error("Fetch Employees Error:", error);
      toast.error("Failed to load employees");
    }
  }, []);

  useEffect(() => {
    fetchLeads();

    if (isAdmin) {
      fetchExecutives();
    }
  }, [
    fetchLeads,
    fetchExecutives,
    isAdmin,
  ]);

  // ==============================
  // FILTER LEADS
  // ==============================

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        (lead.name || "")
          .toLowerCase()
          .includes(query) ||
        (lead.phone || "")
          .includes(query) ||
        (lead.city || "")
          .toLowerCase()
          .includes(query) ||
        (lead.email || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        activeStatus === "All" ||
        lead.status === activeStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    leads,
    search,
    activeStatus,
  ]);

  // ==============================
  // HANDLE FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // ADD NEW LEAD
  // ==============================

  const handleAddNew = () => {
    setEditingLead(null);

    setFormData({
      ...emptyLead,

      assignedTo: !isAdmin
        ? currentUser?._id ||
          currentUser?.id ||
          ""
        : "",
    });

    setShowForm(true);
  };

  // ==============================
  // EDIT LEAD
  // ==============================

  const handleEdit = (lead) => {
    setEditingLead(lead);

    const sanitizedLead = Object.keys(
      emptyLead
    ).reduce((acc, key) => {
      acc[key] =
        lead[key] ??
        emptyLead[key];

      return acc;
    }, {});

    let formattedDate = "";

    if (lead.followUpDate) {
      const date = new Date(
        lead.followUpDate
      );

      if (!Number.isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }
    }

    setFormData({
      ...sanitizedLead,

      tds:
        lead.tds !== null &&
        lead.tds !== undefined
          ? String(lead.tds)
          : "",

      budget:
        lead.budget !== null &&
        lead.budget !== undefined
          ? String(lead.budget)
          : "",

      assignedTo:
        lead.assignedTo?._id ||
        lead.assignedTo ||
        "",

      followUpDate:
        formattedDate,
    });

    setShowForm(true);
  };

  // ==============================
  // SAVE LEAD
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isAdmin &&
      !formData.assignedTo
    ) {
      toast.error(
        "Please select an employee to assign this lead"
      );

      return;
    }

    try {
      const payload = {
        ...formData,

        // Manual TDS number
        tds:
          formData.tds !== ""
            ? Number(formData.tds)
            : null,

        budget:
          formData.budget !== ""
            ? Number(formData.budget)
            : null,
      };

      const targetId =
        getLeadId(editingLead);

      if (
        editingLead &&
        targetId
      ) {
        await updateLead(
          targetId,
          payload
        );

        toast.success(
          "Lead Updated Successfully"
        );
      } else {
        await createLead(payload);

        toast.success(
          "Lead Created Successfully"
        );
      }

      await fetchLeads();

      setFormData(emptyLead);
      setEditingLead(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Submit Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Operation Failed"
      );
    }
  };

  // ==============================
  // STATUS CHANGE
  // ==============================

  const handleStatusChange = async (
    id,
    newStatus
  ) => {
    try {
      await updateLead(
        id,
        {
          status: newStatus,
        }
      );

      toast.success(
        `Status updated to ${newStatus}`
      );

      if (
        newStatus === "Won" &&
        isAdmin
      ) {
        await handleConvert(id);
      } else {
        await fetchLeads();
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      toast.error(
        "Failed to update status"
      );
    }
  };

  // ==============================
  // DELETE LEAD
  // ==============================

  const handleDelete = async (
    id,
    leadName = "this lead"
  ) => {
    if (!id) {
      toast.error(
        "Invalid Lead ID"
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${leadName}?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteLead(id);

      setLeads((prevLeads) =>
        prevLeads.filter(
          (lead) =>
            getLeadId(lead) !== id
        )
      );

      toast.success(
        "Lead Deleted Successfully"
      );

      if (
        selectedLead &&
        getLeadId(selectedLead) === id
      ) {
        setSelectedLead(null);
      }
    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete lead"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // CONVERT LEAD
  // ==============================

  const handleConvert = async (
    id
  ) => {
    try {
      await convertLead(id);

      toast.success(
        "Lead Converted & Customer Created!"
      );

      await fetchLeads();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Conversion Failed"
      );
    }
  };

  // ==============================
  // WHATSAPP
  // ==============================

  const sendWhatsApp = (
    lead
  ) => {
    const sanitizedPhone =
      (lead.phone || "")
        .replace(/\D/g, "");

    const phone =
      sanitizedPhone.startsWith("91")
        ? sanitizedPhone
        : `91${sanitizedPhone}`;

    const message =
      `Hello ${lead.name},

Thank you for contacting Aqua Drop.

We received your enquiry regarding ${
        lead.product ||
        "our water purifier"
      }.

Our team will contact you shortly.

Thank you,
Aqua Drop CRM`;

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank"
    );
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==============================
  // EXPORT CURRENT FILTERED VIEW
  // ==============================
  // Excel/PDF always use the currently filtered leads.
  // So if "New" is selected, only New leads are exported.
  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      toast.info(`No ${activeStatus === "All" ? "" : activeStatus + " "}leads to export`);
      return;
    }

    exportLeadsToExcel(filteredLeads);
    toast.success(
      `${activeStatus === "All" ? "All" : activeStatus} leads exported to Excel`
    );
  };

  const handleExportPDF = () => {
    if (filteredLeads.length === 0) {
      toast.info(`No ${activeStatus === "All" ? "" : activeStatus + " "}leads to export`);
      return;
    }

    exportLeadsToPDF(filteredLeads);
    toast.success(
      `${activeStatus === "All" ? "All" : activeStatus} leads exported to PDF`
    );
  };

  const pipelineStatuses = ["New","Contacted","Interested","Follow Up","Site Visit Scheduled","Site Visit Completed","Quotation Sent","Negotiation","Won","Lost"];
  const isOverdue = (lead) => (lead.nextFollowUpDate || lead.followUpDate) && new Date(lead.nextFollowUpDate || lead.followUpDate) < new Date() && lead.followUpStatus !== "Completed";
  const openQuickFollowUp = (lead) => { setFollowUpLead(lead); setFollowUpData({ date: (lead.nextFollowUpDate || lead.followUpDate) ? new Date(lead.nextFollowUpDate || lead.followUpDate).toISOString().slice(0,16) : "", notes: lead.followUpNotes || "" }); };
  const saveQuickFollowUp = async (e) => { e.preventDefault(); if (!followUpLead || !followUpData.date) return; try { await addFollowUp(getLeadId(followUpLead), followUpData); toast.success("Follow-up scheduled"); setFollowUpLead(null); await fetchLeads(); } catch (error) { toast.error(error?.response?.data?.message || "Failed to schedule follow-up"); } };
  const moveLead = async (lead, status) => { if (lead.status === status) return; try { await updateLead(getLeadId(lead), { status }); toast.success(`Moved to ${status}`); await fetchLeads(); } catch(error) { toast.error("Could not update stage"); } };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="leads-page">

      {/* HEADER */}

      <div className="leads-header">

        <div>
          <h1>
            Leads Management
          </h1>

          <p>
            Manage all Aqua Drop
            customer leads
          </p>
        </div>

        <div className="header-actions">

          <button
            className="excel-btn"
            onClick={handleExportExcel}
            title={`Export ${activeStatus === "All" ? "all" : activeStatus} leads to Excel`}
          >
            📊 Export {activeStatus === "All" ? "All" : activeStatus} Excel
          </button>

          <button
            className="pdf-btn"
            onClick={handleExportPDF}
            title={`Export ${activeStatus === "All" ? "all" : activeStatus} leads to PDF`}
          >
            📄 Export {activeStatus === "All" ? "All" : activeStatus} PDF
          </button>

          <button
            className="refresh-btn"
            onClick={fetchLeads}
          >
            🔄 Refresh
          </button>

          {isAdmin && (
            <button
              className="add-btn"
              onClick={handleAddNew}
            >
              + Add Lead
            </button>
          )}

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">
          <h2>
            {leads.length}
          </h2>

          <p>
            Total Leads
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {
              leads.filter(
                (lead) =>
                  lead.status === "New"
              ).length
            }
          </h2>

          <p>
            New Leads
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {
              leads.filter(
                (lead) =>
                  lead.status === "Won"
              ).length
            }
          </h2>

          <p>
            Won Leads
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {
              leads.filter(
                (lead) =>
                  lead.followUpDate
              ).length
            }
          </h2>

          <p>
            Follow Ups
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="toolbar">

        <input
          className="search-box"
          placeholder="Search by Name / Phone / City"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      <div className="lead-view-toggle">
        <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>☷ List</button>
        <button className={viewMode === "pipeline" ? "active" : ""} onClick={() => setViewMode("pipeline")}>▦ Pipeline</button>
      </div>

      {/* STATUS FILTERS */}

      <div className="status-filters">

        {[
          "All",
          "New",
          "Contacted",
          "Interested",
          "Follow Up",
          "Site Visit Scheduled",
          "Site Visit Completed",
          "Quotation Sent",
          "Negotiation",
          "Won",
          "Lost",
        ].map((status) => (

          <button
            key={status}
            className={
              activeStatus === status
                ? "active-filter"
                : ""
            }
            onClick={() =>
              setActiveStatus(
                status
              )
            }
          >
            {status}
          </button>

        ))}

      </div>

      {viewMode === "pipeline" && (
        <div className="lead-pipeline">
          {pipelineStatuses.map((status) => {
            const stageLeads = filteredLeads.filter(l => l.status === status);
            return <div className="pipeline-column" key={status} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{const id=e.dataTransfer.getData("leadId"); const lead=leads.find(x=>getLeadId(x)===id); if(lead) moveLead(lead,status);}}>
              <div className="pipeline-column-header"><strong>{status}</strong><span>{stageLeads.length}</span></div>
              <div className="pipeline-cards">
                {stageLeads.map(lead => <div className="pipeline-card" key={getLeadId(lead)} draggable onDragStart={(e)=>e.dataTransfer.setData("leadId", getLeadId(lead))}>
                  <div className="pipeline-card-top"><strong>{lead.name}</strong><span className={`priority-dot ${String(lead.priority||"").toLowerCase()}`}>{lead.priority || "Medium"}</span></div>
                  <div className="pipeline-phone">{lead.phone || "-"}</div>
                  <div className="pipeline-meta">{lead.city || "No city"} · {lead.assignedTo?.name || "Unassigned"}</div>
                  {(lead.nextFollowUpDate || lead.followUpDate) && <div className={isOverdue(lead) ? "pipeline-follow overdue" : "pipeline-follow"}>📅 {formatDate(lead.nextFollowUpDate || lead.followUpDate)} {isOverdue(lead) ? "· Overdue" : ""}</div>}
                  <div className="pipeline-actions"><button onClick={()=>setSelectedLead(lead)}>View</button><button onClick={()=>openQuickFollowUp(lead)}>Follow-up</button></div>
                </div>)}
                {stageLeads.length === 0 && <div className="pipeline-empty">Drop leads here</div>}
              </div>
            </div>;
          })}
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="form-card">

          <h2>
            {editingLead
              ? "Edit Lead"
              : "Add New Lead"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* MANUAL TDS */}

              <div className="form-group">
                <label>
                  Water TDS
                </label>

                <input
                  type="number"
                  name="tds"
                  value={
                    formData.tds
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter TDS value"
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label>
                  Water Source
                </label>

                <select
                  name="waterSource"
                  value={
                    formData.waterSource
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="Bore Water">
                    Bore Water
                  </option>

                  <option value="Municipal">
                    Municipal
                  </option>

                  <option value="Mixed">
                    Mixed
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Product
                </label>

                <input
                  type="text"
                  name="product"
                  value={
                    formData.product
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Budget
                </label>

                <input
                  type="number"
                  name="budget"
                  value={
                    formData.budget
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>

              {isAdmin && (

                <div className="form-group">

                  <label>
                    Assigned To *
                  </label>

                  <select
                    name="assignedTo"
                    value={
                      formData.assignedTo
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >

                    <option value="">
                      Select Employee
                    </option>

                    {executives.map(
                      (emp) => (

                        <option
                          key={
                            emp._id ||
                            emp.id
                          }
                          value={
                            emp._id ||
                            emp.id
                          }
                        >
                          {emp.name} (
                          {emp.role})
                        </option>

                      )
                    )}

                  </select>

                </div>

              )}

              {/* DATE SELECT */}

              <div className="form-group">

                <label>
                  Follow Up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={
                    formData.followUpDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Remarks
                </label>

                <textarea
                  rows="4"
                  name="remarks"
                  value={
                    formData.remarks
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >
                {editingLead
                  ? "Update Lead"
                  : "Save Lead"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingLead(null);
                  setFormData(
                    emptyLead
                  );
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* LEADS TABLE */}

      {viewMode === "list" && <div className="table-card">

        <table className="lead-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>TDS</th>
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
                <td
                  colSpan="9"
                  className="empty-row"
                >
                  No Leads Found
                </td>
              </tr>

            ) : (

              filteredLeads.map(
                (lead) => {

                  const leadId =
                    getLeadId(lead);

                  return (

                    <tr
                      key={leadId}
                    >

                      <td>
                        {lead.name}
                      </td>

                      <td>
                        {lead.phone}
                      </td>

                      <td>
                        {lead.city || "-"}
                      </td>

                      <td>
                        {lead.tds !== null && lead.tds !== undefined && lead.tds !== ""
                          ? lead.tds
                          : "-"}
                      </td>

                      <td>
                        {lead.product || "-"}
                      </td>

                      <td>

                        <select
                          className={`status status-${STATUS_CLASS(lead.status)}`}
                          value={lead.status || "New"}
                          onChange={(e) =>
                            handleStatusChange(leadId, e.target.value)
                          }
                        >
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                      </td>

                      <td>

                        <span
                          className={`priority ${lead.priority}`}
                        >
                          {lead.priority}
                        </span>

                      </td>

                      <td>
                        {lead.assignedTo
                          ?.name || "-"}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelectedLead(
                                lead
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(
                                lead
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="whatsapp-btn"
                            onClick={() =>
                              sendWhatsApp(
                                lead
                              )
                            }
                          >
                            WhatsApp
                          </button>

                          {isAdmin &&
                            !lead.isConverted &&
                            lead.status ===
                              "Won" && (

                              <button
                                className="convert-btn"
                                onClick={() =>
                                  handleConvert(
                                    leadId
                                  )
                                }
                              >
                                Convert
                              </button>

                            )}

                          {lead.isConverted && (

                            <span className="converted-badge">
                              Converted
                            </span>

                          )}

                          {isAdmin && (

                            <button
                              className="delete-btn"
                              disabled={
                                deletingId ===
                                leadId
                              }
                              onClick={() =>
                                handleDelete(
                                  leadId,
                                  lead.name
                                )
                              }
                            >
                              {deletingId ===
                              leadId
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  );
                }
              )

            )}

          </tbody>

        </table>

      </div>}

      {/* QUICK FOLLOW-UP */}
      {followUpLead && <div className="popup-overlay"><div className="quick-followup-card"><h2>Schedule Follow-up</h2><p><strong>{followUpLead.name}</strong> · {followUpLead.phone}</p><form onSubmit={saveQuickFollowUp}><label>Date & Time<input type="datetime-local" value={followUpData.date} onChange={e=>setFollowUpData({...followUpData,date:e.target.value})} required /></label><label>Notes<textarea value={followUpData.notes} onChange={e=>setFollowUpData({...followUpData,notes:e.target.value})} placeholder="What should happen next?" /></label><div className="popup-actions"><button className="save-btn" type="submit">Save Follow-up</button><button className="cancel-btn" type="button" onClick={()=>setFollowUpLead(null)}>Cancel</button></div></form></div></div>}

      {/* VIEW LEAD POPUP */}

      {selectedLead && (

        <div className="popup-overlay">

          <div className="popup-card">

            <h2>
              Lead Details
            </h2>

            <p>
              <strong>Name :</strong>{" "}
              {selectedLead.name || "-"}
            </p>

            <p>
              <strong>Phone :</strong>{" "}
              {selectedLead.phone || "-"}
            </p>

            <p>
              <strong>Email :</strong>{" "}
              {selectedLead.email || "-"}
            </p>

            <p>
              <strong>City :</strong>{" "}
              {selectedLead.city || "-"}
            </p>

            <p>
              <strong>Address :</strong>{" "}
              {selectedLead.address || "-"}
            </p>

            <p>
              <strong>Pincode :</strong>{" "}
              {selectedLead.pincode || "-"}
            </p>

            <p>
              <strong>Water TDS :</strong>{" "}
              {selectedLead.tds !== null &&
              selectedLead.tds !== undefined
                ? selectedLead.tds
                : "-"}
            </p>

            <p>
              <strong>
                Water Source :
              </strong>{" "}
              {selectedLead.waterSource ||
                "-"}
            </p>

            <p>
              <strong>Product :</strong>{" "}
              {selectedLead.product || "-"}
            </p>

            <p>
              <strong>Budget :</strong>{" "}
              {selectedLead.budget !==
                null &&
              selectedLead.budget !==
                undefined
                ? `₹${Number(
                    selectedLead.budget
                  ).toLocaleString(
                    "en-IN"
                  )}`
                : "-"}
            </p>

            <p>
              <strong>Status :</strong>{" "}
              {selectedLead.status || "-"}
            </p>

            <p>
              <strong>Priority :</strong>{" "}
              {selectedLead.priority || "-"}
            </p>

            <p>
              <strong>
                Assigned To :
              </strong>{" "}
              {selectedLead.assignedTo
                ?.name || "-"}
            </p>

            <p>
              <strong>
                Follow Up Date :
              </strong>{" "}
              {formatDate(
                selectedLead.followUpDate
              )}
            </p>

            <p>
              <strong>Remarks :</strong>{" "}
              {selectedLead.remarks || "-"}
            </p>

            {/* POPUP BUTTONS */}

            <div className="popup-actions">

              <button
                className="save-btn"
                onClick={() =>
                  setSelectedLead(
                    null
                  )
                }
              >
                Close
              </button>

              {isAdmin && (

                <button
                  className="delete-btn"
                  disabled={
                    deletingId ===
                    getLeadId(
                      selectedLead
                    )
                  }
                  onClick={() =>
                    handleDelete(
                      getLeadId(
                        selectedLead
                      ),
                      selectedLead.name
                    )
                  }
                >
                  {deletingId ===
                  getLeadId(
                    selectedLead
                  )
                    ? "Deleting..."
                    : "Delete Lead"}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}