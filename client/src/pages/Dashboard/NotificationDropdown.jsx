import React from "react";
import "./NotificationDropdown.css";
import {
  FaBell,
  FaUserPlus,
  FaTools,
  FaMoneyBillWave,
} from "react-icons/fa";

const notifications = [
  {
    id: 1,
    icon: <FaUserPlus />,
    title: "New Lead Added",
    time: "2 mins ago",
    color: "#2563EB",
  },
  {
    id: 2,
    icon: <FaTools />,
    title: "Installation Completed",
    time: "25 mins ago",
    color: "#10B981",
  },
  {
    id: 3,
    icon: <FaMoneyBillWave />,
    title: "Payment Received",
    time: "1 hour ago",
    color: "#F59E0B",
  },
];

const NotificationDropdown = () => {
  return (
    <div className="notification-dropdown">

      <div className="notification-header">
        <h3>
          <FaBell /> Notifications
        </h3>

        <span>3 New</span>
      </div>

      {notifications.map((item) => (
        <div className="notification-item" key={item.id}>

          <div
            className="notification-icon"
            style={{ background: item.color }}
          >
            {item.icon}
          </div>

          <div className="notification-content">
            <h4>{item.title}</h4>
            <p>{item.time}</p>
          </div>

        </div>
      ))}

      <button className="view-all-btn">
        View All Notifications
      </button>

    </div>
  );
};

export default NotificationDropdown;
