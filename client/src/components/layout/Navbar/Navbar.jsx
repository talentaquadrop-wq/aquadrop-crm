import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaPlus,
  FaChevronDown,
} from "react-icons/fa";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userName =
    user?.name || "Admin";

  const userRole =
    user?.role || "Administrator";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="top-navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">

        <div className="navbar-search">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* QUICK ACTION */}
        <button className="quick-action-btn">
          <FaPlus />
          <span>Quick Action</span>
          <FaChevronDown className="dropdown-icon" />
        </button>


        {/* NOTIFICATION */}
        <button
          className="navbar-icon-btn"
          title="Notifications"
        >
          <FaBell />

          <span className="notification-dot">
            0
          </span>
        </button>


        {/* USER */}
        <div className="navbar-user">

          <div className="navbar-avatar">
            {userName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="navbar-user-info">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

          <FaChevronDown className="user-arrow" />

        </div>


        {/* LOGOUT */}
        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;