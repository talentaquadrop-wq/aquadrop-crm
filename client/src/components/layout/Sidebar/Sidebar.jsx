import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUserFriends,
  FaUsers,
  FaTools,
  FaHeadset,
  FaTruck,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaChartBar,
  FaPhoneAlt,
  FaCog,
  FaSignOutAlt,
  FaTint,
  FaHistory,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-top">

        <div className="sidebar-logo">

          <div className="logo-icon">
            <FaTint />
          </div>

          <div className="logo-text">
            <h2>Aqua Drop</h2>
            <span>CRM SYSTEM</span>
          </div>

        </div>

      </div>


      {/* MENU */}
      <div className="sidebar-menu">

        {/* MAIN */}
        <div className="menu-section">

          <span className="menu-title">MAIN</span>

          <NavLink
            to="/dashboard"
            className="menu-item"
          >
            <FaHome className="menu-icon" />
            <span>Dashboard</span>
          </NavLink>

        </div>


        {/* SALES */}
        <div className="menu-section">

          <span className="menu-title">SALES</span>

          <NavLink
            to="/leads"
            className="menu-item"
          >
            <FaUserFriends className="menu-icon" />
            <span>Leads</span>
          </NavLink>

          <NavLink
            to="/customers"
            className="menu-item"
          >
            <FaUsers className="menu-icon" />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/quotations"
            className="menu-item"
          >
            <FaFileInvoiceDollar className="menu-icon" />
            <span>Quotations</span>
          </NavLink>

        </div>


        {/* OPERATIONS */}
        <div className="menu-section">

          <span className="menu-title">OPERATIONS</span>

          <NavLink
            to="/installations"
            className="menu-item"
          >
            <FaTools className="menu-icon" />
            <span>Installations</span>
          </NavLink>

          <NavLink
            to="/services"
            className="menu-item"
          >
            <FaHeadset className="menu-icon" />
            <span>Services</span>
          </NavLink>

          <NavLink
            to="/dispatch"
            className="menu-item"
          >
            <FaTruck className="menu-icon" />
            <span>Dispatch</span>
          </NavLink>

        </div>


        {/* INVENTORY */}
        <div className="menu-section">

          <span className="menu-title">INVENTORY</span>

          <NavLink
            to="/inventory"
            className="menu-item"
          >
            <FaBoxOpen className="menu-icon" />
            <span>Products</span>
          </NavLink>

        </div>


        {/* MANAGEMENT */}
        <div className="menu-section">

          <span className="menu-title">MANAGEMENT</span>

          <NavLink
            to="/employees"
            className="menu-item"
          >
            <FaUsers className="menu-icon" />
            <span>Employees</span>
          </NavLink>

          <NavLink
            to="/calls"
            className="menu-item"
          >
            <FaPhoneAlt className="menu-icon" />
            <span>Calls / IVR</span>
          </NavLink>

          <NavLink
            to="/reports"
            className="menu-item"
          >
            <FaChartBar className="menu-icon" />
            <span>Reports</span>
          </NavLink>

          {(user?.role === "Admin" || user?.role === "Manager") && <NavLink to="/audit-logs" className="menu-item"><FaHistory className="menu-icon" /><span>Audit Logs</span></NavLink>}

        </div>


        {/* SETTINGS */}
        <div className="menu-section">

          <span className="menu-title">SYSTEM</span>

          <NavLink
            to="/settings"
            className="menu-item"
          >
            <FaCog className="menu-icon" />
            <span>Settings</span>
          </NavLink>

        </div>

      </div>


      {/* USER + LOGOUT */}
      <div className="sidebar-footer">

        <div className="sidebar-user">

          <div className="admin-avatar">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>

          <div className="admin-details">
            <h4>{user?.name || "Admin"}</h4>

            <p>
              {user?.role || "Administrator"}
            </p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;