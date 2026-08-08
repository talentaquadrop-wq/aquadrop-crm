import React, { useState, useEffect } from "react";
import "./LeadModal.css";

export default function LeadModal({
  open,
  onClose,
  onSave,
  editLead,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    city: "",
    product: "",
    source: "",
    assigned: "",
    status: "New",
  });

  useEffect(() => {
    if (editLead) {
      setFormData(editLead);
    } else {
      setFormData({
        id: "",
        name: "",
        phone: "",
        city: "",
        product: "",
        source: "",
        assigned: "",
        status: "New",
      });
    }
  }, [editLead]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.city
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="lead-modal">

        <div className="modal-header">
          <h2>
            {editLead ? "Edit Lead" : "Add New Lead"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              name="id"
              placeholder="Lead ID"
              value={formData.id}
              onChange={handleChange}
            />

            <input
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              name="product"
              placeholder="Interested Product"
              value={formData.product}
              onChange={handleChange}
            />

            <input
              name="source"
              placeholder="Lead Source"
              value={formData.source}
              onChange={handleChange}
            />

            <input
              name="assigned"
              placeholder="Assigned Employee"
              value={formData.assigned}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-up</option>
              <option>Interested</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Save Lead
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}