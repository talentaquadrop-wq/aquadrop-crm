import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../services/serviceService";

import "./Services.css";

const emptyService = {
  customer: "",
  phone: "",
  serviceType: "General Service",
  problem: "",
  technician: "",
  serviceDate: "",
  status: "Pending",
  remarks: "",
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState(emptyService);

  // =============================
  // Fetch Services
  // =============================
  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await getServices();

      setServices(res.data || []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // =============================
  // Search Filter
  // =============================
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      return (
        item.customer
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        item.phone?.includes(search) ||

        item.technician
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        item.serviceType
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [services, search]);

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
  // Add New
  // =============================
  const handleAddNew = () => {
    setEditingService(null);

    setFormData(emptyService);

    setShowForm(true);
  };
    // =============================
  // Edit Service
  // =============================
  const handleEdit = (service) => {
    setEditingService(service);

    setFormData({
      customer: service.customer,
      phone: service.phone,
      serviceType: service.serviceType,
      problem: service.problem,
      technician: service.technician,
      serviceDate: service.serviceDate
        ? service.serviceDate.split("T")[0]
        : "",
      status: service.status,
      remarks: service.remarks,
    });

    setShowForm(true);
  };

  // =============================
  // Save Service
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingService) {

        await updateService(
          editingService._id,
          formData
        );

        toast.success("Service Updated Successfully");

      } else {

        await createService(formData);

        toast.success("Service Added Successfully");

      }

      fetchServices();

      setShowForm(false);

      setEditingService(null);

      setFormData(emptyService);

    } catch (error) {

      console.error(error);

      toast.error("Operation Failed");

    }
  };

  // =============================
  // Delete
  // =============================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this service?"))
      return;

    try {

      await deleteService(id);

      toast.success("Service Deleted");

      fetchServices();

    } catch (error) {

      console.error(error);

      toast.error("Delete Failed");

    }

  };

  // =============================
  // Dashboard Cards
  // =============================

  const totalServices = services.length;

  const pending = services.filter(
    (x) => x.status === "Pending"
  ).length;

  const progress = services.filter(
    (x) => x.status === "In Progress"
  ).length;

  const completed = services.filter(
    (x) => x.status === "Completed"
  ).length;

  return (
    <div className="services-container">

          <div className="services-header">

            <div>

              <h1>Services Management</h1>

              <p>
                Manage Aqua Drop customer services
              </p>

            </div>

            <button
              className="add-btn"
              onClick={handleAddNew}
            >
              + Add Service
            </button>

          </div>

          {/* Dashboard Cards */}

          <div className="stats-grid">

            <div className="stat-card">

              <h2>{totalServices}</h2>

              <p>Total Services</p>

            </div>

            <div className="stat-card pending">

              <h2>{pending}</h2>

              <p>Pending</p>

            </div>

            <div className="stat-card progress">

              <h2>{progress}</h2>

              <p>In Progress</p>

            </div>

            <div className="stat-card completed">

              <h2>{completed}</h2>

              <p>Completed</p>

            </div>

          </div>

          {/* Search */}

          <div className="toolbar">

            <input
              type="text"
              className="search-box"
              placeholder="Search Service..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>
                    {/* ==========================
              Service Form
          =========================== */}

          {showForm && (
            <div className="form-card">

              <h2>
                {editingService
                  ? "Edit Service"
                  : "Add New Service"}
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="form-grid">

                  <div className="form-group">
                    <label>Customer Name</label>

                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
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
                    <label>Service Type</label>

                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                    >
                      <option>General Service</option>
                      <option>Filter Replacement</option>
                      <option>Repair</option>
                      <option>Maintenance</option>
                      <option>Installation Follow-up</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Technician</label>

                    <input
                      type="text"
                      name="technician"
                      value={formData.technician}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Service Date</label>

                    <input
                      type="date"
                      name="serviceDate"
                      value={formData.serviceDate}
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
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>

                  <div className="form-group full-width">

                    <label>Problem</label>

                    <textarea
                      rows="3"
                      name="problem"
                      value={formData.problem}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="form-group full-width">

                    <label>Remarks</label>

                    <textarea
                      rows="3"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {editingService
                      ? "Update Service"
                      : "Save Service"}
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
          )}
                    {/* ==========================
              Services Table
          =========================== */}

          <div className="table-card">

            <table className="service-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service Type</th>
                  <th>Technician</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-data"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : filteredServices.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-data"
                    >
                      No Services Found
                    </td>

                  </tr>

                ) : (

                  filteredServices.map(
                    (service, index) => (

                      <tr key={service._id}>

                        <td>{index + 1}</td>

                        <td>
                          {service.customer}
                        </td>

                        <td>
                          {service.phone}
                        </td>

                        <td>
                          {service.serviceType}
                        </td>

                        <td>
                          {service.technician}
                        </td>

                        <td>
                          {new Date(
                            service.serviceDate
                          ).toLocaleDateString()}
                        </td>

                        <td>

                          <span
                            className={`status ${service.status
                              .replace(/\s/g, "")
                              .toLowerCase()}`}
                          >
                            {service.status}
                          </span>

                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(service)
                              }
                            >
                              ✏ Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  service._id
                                )
                              }
                            >
                              🗑 Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

    </div>

  );

}