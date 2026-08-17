import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserFriends,
  FaUsers,
  FaTruck,
  FaTools,
  FaClipboardList,
  FaBoxOpen,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUserTie,
  FaFileInvoice,
  FaPhoneAlt,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const role = user?.role || "";

  // =========================================
  // MENU ITEMS
  // =========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      roles: [
        "Admin",
        "Manager",
        "Executive",
        "Sales",
        "Inventory",
        "Dispatch",
        "Service",
      ],
    },

    {
      name: "Leads",
      path: "/leads",
      icon: <FaUsers />,
      roles: [
        "Admin",
        "Manager",
        "Executive",
        "Sales",
      ],
    },

    {
      name: "IVR Management",
      path: "/ivr",
      icon: <FaPhoneAlt />,
      roles: [
        "Admin",
        "Manager",
      ],
    },

    {
      name: "Customers",
      path: "/customers",
      icon: <FaUserFriends />,
      roles: [
        "Admin",
        "Manager",
        "Executive",
        "Sales",
      ],
    },

    {
      name: "Quotations",
      path: "/quotations",
      icon: <FaFileInvoice />,
      roles: [
        "Admin",
        "Manager",
        "Executive",
        "Sales",
      ],
    },

    {
      name: "Inventory",
      path: "/inventory",
      icon: <FaBoxOpen />,
      roles: [
        "Admin",
        "Inventory",
      ],
    },

    {
      name: "Dispatch",
      path: "/dispatch",
      icon: <FaTruck />,
      roles: [
        "Admin",
        "Inventory",
        "Dispatch",
      ],
    },

    {
      name: "Installations",
      path: "/installations",
      icon: <FaTools />,
      roles: [
        "Admin",
        "Service",
      ],
    },

    {
      name: "Services",
      path: "/services",
      icon: <FaClipboardList />,
      roles: [
        "Admin",
        "Service",
      ],
    },

    {
      name: "Employees",
      path: "/employees",
      icon: <FaUserTie />,
      roles: [
        "Admin",
      ],
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar />,
      roles: [
        "Admin",
      ],
    },

    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
      roles: [
        "Admin",
      ],
    },
  ];

  // =========================================
  // FILTER MENU BY ROLE
  // =========================================

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================
  // SIDEBAR
  // =========================================

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div>
          <h2>Aqua Drop</h2>
          <span>CRM</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-menu">

        {filteredMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "menu-item active"
                : "menu-item"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>
        ))}

      </nav>

      {/* USER */}
      <div className="sidebar-footer">

        <div className="admin-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div>
          <h4>
            {user?.name || "Guest"}
          </h4>

          <p>
            {user?.role || "User"}
          </p>
        </div>

      </div>

      {/* LOGOUT */}
      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />

        <span>
          Logout
        </span>
      </button>

    </aside>
  );
};

export default Sidebar;