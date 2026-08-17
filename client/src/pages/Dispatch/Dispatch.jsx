import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { exportDispatchExcel } from "../../utils/exportDispatchExcel";
import { exportDispatchPDF } from "../../utils/exportDispatchPDF";
import { FaPrint } from "react-icons/fa";
import {
  getDispatches,
  createDispatch,
  updateDispatch,
  deleteDispatch,
  getDispatchStats,
} from "../../services/dispatchService";

import "./Dispatch.css";

const emptyDispatch = {
  customer: "",
  phone: "",
  address: "",
  city: "",
  product: "",
  quantity: 1,
  dispatchDate: "",
  driver: "",
  vehicleNumber: "",
  trackingNumber: "",
  transport: "Own Vehicle",
  priority: "Medium",
  status: "Pending",
  remarks: "",
};

export default function Dispatch() {
  const [dispatches, setDispatches] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState(null);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [formData, setFormData] = useState(emptyDispatch);
  const [filter, setFilter] = useState("All");

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      const res = await getDispatches();
      setDispatches(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dispatches");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getDispatchStats();
      setStats(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDispatches();
    fetchStats();
  }, []);

  const handleAddNew = () => {
    setEditingDispatch(null);
    setFormData(emptyDispatch);
    setShowForm(true);
  };

  const handleEdit = (dispatch) => {
    setEditingDispatch(dispatch);
    setFormData(dispatch);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDispatch) {
        await updateDispatch(editingDispatch._id, formData);
        toast.success("Dispatch Updated Successfully");
      } else {
        await createDispatch(formData);
        toast.success("Dispatch Added Successfully");
      }
      fetchDispatches();
      fetchStats();

      setShowForm(false);
      setEditingDispatch(null);
      setFormData(emptyDispatch);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Save Dispatch");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Dispatch?")) return;

    try {
      await deleteDispatch(id);
      toast.success("Dispatch Deleted");
      fetchDispatches();
      fetchStats();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const handleView = (dispatch) => {
    setSelectedDispatch(dispatch);
  };

  const closeModal = () => {
    setSelectedDispatch(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";
      case "Packed":
        return "packed";
      case "Dispatched":
        return "dispatched";
      case "Out For Delivery":
        return "out-for-delivery";
      case "Delivered":
        return "delivered";
      default:
        return "";
    }
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((item) => {
      const matchSearch =
        item.customer?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.includes(search) ||
        item.product?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "All" ? true : item.status === filter;

      return matchSearch && matchFilter;
    });
  }, [dispatches, search, filter]);

  return (
    
    <div className="dispatch-container">
          <div className="dispatch-header">
            <div>
              <h1>Dispatch Management</h1>
              <p>Track and manage product shipments</p>
            </div>
            <div className="header-actions">

<button
className="excel-btn"
onClick={() => exportDispatchExcel(dispatches)}
>
📗 Export Excel
</button>
<button
  className="pdf-btn"
  onClick={() => exportDispatchPDF(dispatches)}
>
  📄 Export PDF
</button>
<button
className="refresh-btn"
onClick={()=>{
fetchDispatches();
fetchStats();
}}
>
🔄 Refresh
</button>

<button
className="add-btn"
onClick={handleAddNew}
>
➕ Create Dispatch
</button>
</div>

</div>
          <div className="dispatch-stats">
            <div className="dispatch-stat-card">
              <h2>{stats.totalDispatches || 0}</h2>
              <p>Total Dispatches</p>
            </div>
            <div className="dispatch-stat-card">
              <h2>{stats.pending || 0}</h2>
              <p>Pending</p>
            </div>
            <div className="dispatch-stat-card">
              <h2>{stats.packed || 0}</h2>
              <p>Packed</p>
            </div>
            <div className="dispatch-stat-card">
              <h2>{stats.dispatched || 0}</h2>
              <p>Dispatched</p>
            </div>
            <div className="dispatch-stat-card">
              <h2>{stats.outForDelivery || 0}</h2>
              <p>Out For Delivery</p>
            </div>
            <div className="dispatch-stat-card">
              <h2>{stats.delivered || 0}</h2>
              <p>Delivered</p>
            </div>
          </div>

          <div className="toolbar">
            <input
              type="text"
              className="search-box"
              placeholder="Search Customer, Phone or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="dispatch-filters">
            <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
            <button className={filter === "Pending" ? "active" : ""} onClick={() => setFilter("Pending")}>Pending</button>
            <button className={filter === "Packed" ? "active" : ""} onClick={() => setFilter("Packed")}>Packed</button>
            <button className={filter === "Dispatched" ? "active" : ""} onClick={() => setFilter("Dispatched")}>Dispatched</button>
            <button className={filter === "Out For Delivery" ? "active" : ""} onClick={() => setFilter("Out For Delivery")}>Out For Delivery</button>
            <button className={filter === "Delivered" ? "active" : ""} onClick={() => setFilter("Delivered")}>Delivered</button>
          </div>

          {showForm && (
            <div className="form-card">
              <h2>{editingDispatch ? "Edit Dispatch" : "Create New Dispatch"}</h2>
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
                    <label>Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      name="address"
                      rows="2"
                      value={formData.address}
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
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Dispatch Date</label>
                    <input
                      type="date"
                      name="dispatchDate"
                      value={formData.dispatchDate || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Transport</label>
                    <select
                      name="transport"
                      value={formData.transport}
                      onChange={handleChange}
                    >
                      <option>Own Vehicle</option>
                      <option>Courier</option>
                      <option>Transport</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Driver Name</label>
                    <input
                      type="text"
                      name="driver"
                      value={formData.driver}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>Pending</option>
                      <option>Packed</option>
                      <option>Dispatched</option>
                      <option>Out For Delivery</option>
                      <option>Delivered</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      rows="3"
                      value={formData.remarks}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      {editingDispatch ? "Update Dispatch" : "Save Dispatch"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowForm(false);
                        setEditingDispatch(null);
                        setFormData(emptyDispatch);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="table-card">
            <table className="dispatch-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Dispatch Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No Dispatches Found
                    </td>
                  </tr>
                ) : (
                  filteredDispatches.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {getInitial(item.customer)}
                          </div>
                          <div>
                            <h4>{item.customer}</h4>
                            <p>{item.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>{item.driver || "-"}</td>
                      <td>
                        <span className={`status ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.dispatchDate
                          ? new Date(item.dispatchDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => handleView(item)}
                          >
                            👁
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            ✏
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            🗑
                            <button
  className="print-btn"
  onClick={() => window.print()}
>
  <FaPrint /> Print
</button>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button>Previous</button>
            <span>Page 1 of 1</span>
            <button>Next</button>
          </div>

          {selectedDispatch && (
            <div className="view-modal">
              <div className="view-card">
                <div className="view-header">
                  <h2>Dispatch Details</h2>
                  <button onClick={closeModal}>✕</button>
                </div>
                <div className="profile-section">
                  <div className="profile-avatar">
                    {getInitial(selectedDispatch.customer)}
                  </div>
                  <h3>{selectedDispatch.customer}</h3>
                  <p>{selectedDispatch.phone}</p>
                </div>
                <div className="detail-grid">
                  <div>
                    <label>Product</label>
                    <p>{selectedDispatch.product}</p>
                  </div>
                  <div>
                    <label>Quantity</label>
                    <p>{selectedDispatch.quantity}</p>
                  </div>
                  <div>
                    <label>Driver</label>
                    <p>{selectedDispatch.driver || "-"}</p>
                  </div>
                  <div>
                    <label>Vehicle</label>
                    <p>{selectedDispatch.vehicleNumber || "-"}</p>
                  </div>
                  <div>
                    <label>Tracking No</label>
                    <p>{selectedDispatch.trackingNumber || "-"}</p>
                  </div>
                  <div>
                    <label>Status</label>
                    <p>{selectedDispatch.status}</p>
                  </div>
                  <div>
                    <label>Priority</label>
                    <p>{selectedDispatch.priority}</p>
                  </div>
                  <div>
                    <label>Transport</label>
                    <p>{selectedDispatch.transport}</p>
                  </div>
                  <div className="full-width">
                    <label>Address</label>
                    <p>{selectedDispatch.address}</p>
                  </div>
                  <div className="full-width">
                    <label>Remarks</label>
                    <p>{selectedDispatch.remarks || "-"}</p>
                  </div>
                </div>
                <div className="profile-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      const current = selectedDispatch;
                      setSelectedDispatch(null);
                      handleEdit(current);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      const id = selectedDispatch._id;
                      setSelectedDispatch(null);
                      handleDelete(id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}