import React from "react";
import "./DashboardCards.css";

import {
  FaRupeeSign,
  FaUsers,
  FaUserFriends,
  FaBoxOpen,
  FaTruck,
  FaTools,
  FaClipboardCheck,
  FaUserTie,
} from "react-icons/fa";

const DashboardCards = () => {

  const cards = [

    {
      title: "Revenue",
      value: "₹25,48,000",
      icon: <FaRupeeSign />,
      color: "#10B981",
    },

    {
      title: "Customers",
      value: "548",
      icon: <FaUsers />,
      color: "#2563EB",
    },

    {
      title: "Leads",
      value: "321",
      icon: <FaUserFriends />,
      color: "#F59E0B",
    },

    {
      title: "Inventory",
      value: "864",
      icon: <FaBoxOpen />,
      color: "#8B5CF6",
    },

    {
      title: "Dispatch",
      value: "85",
      icon: <FaTruck />,
      color: "#EF4444",
    },

    {
      title: "Services",
      value: "36",
      icon: <FaTools />,
      color: "#0EA5E9",
    },

    {
      title: "Installations",
      value: "52",
      icon: <FaClipboardCheck />,
      color: "#14B8A6",
    },

    {
      title: "Employees",
      value: "18",
      icon: <FaUserTie />,
      color: "#F97316",
    },

  ];

  return (

    <div className="dashboard-cards">

      {cards.map((card, index) => (

        <div
          className="dashboard-card"
          key={index}
        >

          <div
            className="dashboard-icon"
            style={{
              background: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="dashboard-info">

            <h4>{card.title}</h4>

            <h2>{card.value}</h2>

          </div>

        </div>

      ))}

    </div>

  );

};

export default DashboardCards;