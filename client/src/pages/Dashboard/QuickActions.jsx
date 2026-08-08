import React from "react";
import "./QuickActions.css";
import {
  FaUserPlus,
  FaUsers,
  FaTools,
  FaClipboardList,
  FaBoxes,
  FaChartBar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Lead",
      icon: <FaUserPlus />,
      color: "#2563EB",
      path: "/leads",
    },
    {
      title: "Customers",
      icon: <FaUsers />,
      color: "#10B981",
      path: "/customers",
    },
    {
      title: "Installation",
      icon: <FaTools />,
      color: "#F59E0B",
      path: "/installations",
    },
    {
      title: "Services",
      icon: <FaClipboardList />,
      color: "#8B5CF6",
      path: "/services",
    },
    {
      title: "Inventory",
      icon: <FaBoxes />,
      color: "#EF4444",
      path: "/inventory",
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      color: "#06B6D4",
      path: "/reports",
    },
  ];

  return (
    <div className="quick-actions-card">

      <h3>Quick Actions</h3>

      <div className="quick-grid">

        {actions.map((item, index) => (

          <div
            key={index}
            className="quick-item"
            onClick={() => navigate(item.path)}
          >

            <div
              className="quick-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <h4>{item.title}</h4>

          </div>

        ))}

      </div>

    </div>
  );
};

export default QuickActions;