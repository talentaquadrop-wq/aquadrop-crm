import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaUserPlus,
  FaUsers,
  FaTools,
  FaHeadset,
  FaBoxOpen,
} from "react-icons/fa";

import "./QuickActions.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add New Lead",
      description: "Create a new sales lead",
      icon: <FaUserPlus />,
      path: "/leads",
      className: "lead-action",
    },
    {
      title: "Add Customer",
      description: "Register a new customer",
      icon: <FaUsers />,
      path: "/customers",
      className: "customer-action",
    },
    {
      title: "New Installation",
      description: "Schedule an installation",
      icon: <FaTools />,
      path: "/installations",
      className: "installation-action",
    },
    {
      title: "Create Service",
      description: "Add a service request",
      icon: <FaHeadset />,
      path: "/services",
      className: "service-action",
    },
    {
      title: "Add Product",
      description: "Add inventory product",
      icon: <FaBoxOpen />,
      path: "/products",
      className: "product-action",
    },
  ];

  return (
    <div className="quick-actions-card">
      <div className="quick-actions-header">
        <div>
          <h3>Quick Actions</h3>
          <p>Frequently used actions</p>
        </div>
      </div>

      <div className="quick-actions-list">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`quick-action-item ${action.className}`}
            onClick={() => navigate(action.path)}
          >
            <div className="quick-action-left">
              <div className="quick-action-icon">
                {action.icon}
              </div>

              <div className="quick-action-text">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </div>
            </div>

            <FaPlus className="quick-action-plus" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;