import React from "react";
import "./WelcomeSection.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUsers,
  FaTools,
  FaChartBar,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

const WelcomeSection = ({
  pendingServices,
  installations,
  lowStock,
  totalLeads,
}) => {
  const navigate = useNavigate();

  // Logged in User
  const user = JSON.parse(localStorage.getItem("user"));

  // Greeting
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  // Today's Date
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="welcome-container">
      <div className="welcome-left">
        <span className="welcome-tag">
          Aqua Drop Water Solutions CRM
        </span>

        <h1>
          {greeting}, {user?.name || "User"} 👋
        </h1>

        <p>
          Welcome back! Here's a quick overview of today's business activity.
        </p>

        <div className="today-info">
          <div>
            <FaCalendarAlt />
            <span>{today}</span>
          </div>

          <div>
            <FaClipboardList />
            <span>Stay focused on today's tasks</span>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-box">
            <h3>{pendingServices}</h3>
            <p>Pending Services</p>
          </div>

          <div className="summary-box">
            <h3>{installations}</h3>
            <p>Today's Installations</p>
          </div>

          <div className="summary-box">
            <h3>{lowStock}</h3>
            <p>Low Stock Items</p>
          </div>

          <div className="summary-box">
            <h3>{totalLeads}</h3>
            <p>Total Leads</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>

        <button onClick={() => navigate("/leads")}>
          <FaUserPlus />
          Add Lead
        </button>

        <button onClick={() => navigate("/customers")}>
          <FaUsers />
          Add Customer
        </button>

        <button onClick={() => navigate("/installations")}>
          <FaTools />
          Installation
        </button>

        <button onClick={() => navigate("/reports")}>
          <FaChartBar />
          Reports
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;