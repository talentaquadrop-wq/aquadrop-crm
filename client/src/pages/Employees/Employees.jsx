import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Navbar from "../../components/layout/Navbar/Navbar";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword,
} from "../../services/employeeService";
import "./Employees.css";

const INITIAL_FORM_STATE = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  role: "Executive",
  department: "",
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [resetPasswordInput, setResetPasswordInput] = useState("");

  // 1. Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEmployees();

      if (res.success) {
        setEmployees(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch employees");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Server error while fetching employees"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Derived filtered state (computed during render)
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((emp) => {
      const nameMatch = emp.name?.toLowerCase().includes(query);
      const empIdMatch = emp.employeeId?.toLowerCase().includes(query);
      const usernameMatch = emp.username?.toLowerCase().includes(query);
      return nameMatch || empIdMatch || usernameMatch;
    });
  }, [searchQuery, employees]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedEmployeeId(null);
    setFormData(INITIAL_FORM_STATE);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setIsEditing(true);
    setSelectedEmployeeId(employee._id);
    setFormData({
      name: employee.name || "",
      username: employee.username || "",
      email: employee.email || "",
      phone: employee.phone || "",
      password: "",
      role: employee.role || "Executive",
      department: employee.department || "",
    });
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setSelectedEmployeeId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Form Submit Handler (Create & Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
        };

        const res = await updateEmployee(selectedEmployeeId, updatePayload);
        if (res.success) {
          toast.success(res.message || "Employee updated successfully");
          fetchEmployees();
          handleCloseFormModal();
        } else {
          toast.error(res.message || "Failed to update employee");
        }
      } else {
        const res = await createEmployee(formData);
        if (res.success) {
          toast.success(res.message || "Employee created successfully");
          fetchEmployees();
          handleCloseFormModal();
        } else {
          toast.error(res.message || "Failed to create employee");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error submitting employee form"
      );
    }
  };

  // 3. Toggle Active Status
  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleEmployeeStatus(id);
      if (res.success) {
        toast.success(res.message || "Status updated successfully");
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === id ? { ...emp, isActive: !emp.isActive } : emp
          )
        );
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error toggling employee status"
      );
    }
  };

  // 4. Password Reset Handler
  const handleOpenResetModal = (id) => {
    setSelectedEmployeeId(id);
    setResetPasswordInput("");
    setIsResetModalOpen(true);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (resetPasswordInput && resetPasswordInput.length < 6) {
      toast.error("Password should be minimum 6 characters");
      return;
    }

    try {
      const res = await resetEmployeePassword(selectedEmployeeId, {
        newPassword: resetPasswordInput || "Temp@123",
      });

      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        setIsResetModalOpen(false);
        setResetPasswordInput("");
        setSelectedEmployeeId(null);
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error resetting employee password"
      );
    }
  };

  // 5. Delete Employee
  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete employee "${name}"?`)) {
      try {
        const res = await deleteEmployee(id);
        if (res.success) {
          toast.success(res.message || "Employee deleted successfully");
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        } else {
          toast.error(res.message || "Failed to delete employee");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error deleting employee"
        );
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h2 className="page-title">Employee Management</h2>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              + Add Employee
            </button>
          </div>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by Name, Employee ID, or Username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="loading-spinner">Loading Employees...</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp._id}>
                        <td>
                          <strong>{emp.employeeId || "N/A"}</strong>
                        </td>
                        <td>{emp.name}</td>
                        <td>{emp.username}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone || "-"}</td>
                        <td>
                          <span className="badge badge-role">{emp.role}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              emp.isActive ? "badge-active" : "badge-inactive"
                            }`}
                          >
                            {emp.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-edit"
                              title="Edit Employee"
                              onClick={() => handleOpenEditModal(emp)}
                            >
                              Edit
                            </button>
                            <button
                              className={`btn-icon ${
                                emp.isActive
                                  ? "btn-deactivate"
                                  : "btn-activate"
                              }`}
                              title="Toggle Active Status"
                              onClick={() => handleToggleStatus(emp._id)}
                            >
                              {emp.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              className="btn-icon btn-reset"
                              title="Reset Password"
                              onClick={() => handleOpenResetModal(emp._id)}
                            >
                              Reset
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              title="Delete Employee"
                              onClick={() =>
                                handleDeleteEmployee(emp._id, emp.name)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Add / Edit Modal */}
          {isFormModalOpen && (
            <div className="modal-overlay" onClick={handleCloseFormModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>{isEditing ? "Edit Employee" : "Add New Employee"}</h3>
                  <button
                    className="modal-close-btn"
                    onClick={handleCloseFormModal}
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        placeholder="e.g. johndoe"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={isEditing}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="e.g. john@aquadrop.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    {!isEditing && (
                      <div className="form-group">
                        <label>Password (Temporary)</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Defaults to Temp@123"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        name="role"
                        className="form-control"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Executive">Executive</option>
                        <option value="Manager">Manager</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Service">Service</option>
                        <option value="Dispatch">Dispatch</option>
                        <option value="Technician">Technician</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        className="form-control"
                        placeholder="e.g. Sales / Water Filtration"
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseFormModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? "Update Employee" : "Create Employee"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reset Password Modal */}
          {isResetModalOpen && (
            <div
              className="modal-overlay"
              onClick={() => setIsResetModalOpen(false)}
            >
              <div
                className="modal-content modal-small"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Reset Employee Password</h3>
                  <button
                    className="modal-close-btn"
                    onClick={() => setIsResetModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleResetPasswordSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Leave blank for 'Temp@123'"
                        value={resetPasswordInput}
                        onChange={(e) => setResetPasswordInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsResetModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;