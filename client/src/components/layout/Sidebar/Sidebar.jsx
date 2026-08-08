import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaTruck,
  FaTools,
  FaClipboardList,
  FaBoxOpen,
  FaChartBar,
  FaCog,
  FaTint,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "";

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      roles: ["Admin", "Executive", "Inventory", "Dispatch", "Service"],
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <FaUsers />,
      roles: ["Admin", "Executive"],
    },
    {
      name: "Leads",
      path: "/leads",
      icon: <FaUserFriends />,
      roles: ["Admin", "Executive"],
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <FaBoxOpen />,
      roles: ["Admin", "Inventory"],
    },
    {
      name: "Dispatch",
      path: "/dispatch",
      icon: <FaTruck />,
      roles: ["Admin", "Inventory", "Dispatch"],
    },
    {
      name: "Installations",
      path: "/installations",
      icon: <FaTools />,
      roles: ["Admin", "Service"],
    },
    {
      name: "Services",
      path: "/services",
      icon: <FaClipboardList />,
      roles: ["Admin", "Service"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <FaUserTie />,
      roles: ["Admin"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar />,
      roles: ["Admin"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
      roles: ["Admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaTint className="logo-icon" />

        <div>
          <h2>Aqua Drop</h2>
          <span>CRM</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div>
          <h4>{user?.name || "Guest"}</h4>
          <p>{user?.role || "User"}</p>
        </div>
      </div>

      <div
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;