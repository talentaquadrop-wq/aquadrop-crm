import React, { useEffect, useState } from "react";
import "./SummaryCards.css";
import {
  FaRupeeSign,
  FaShoppingCart,
  FaUsers,
  FaTools,
} from "react-icons/fa";

import { getReports } from "../../services/reportService";

const SummaryCards = () => {

  const [report, setReport] = useState({
    totalRevenue: 0,
    totalProductsSold: 0,
    totalCustomers: 0,
    totalServices: 0,
  });

  const fetchReports = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        setReport(res.data);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchReports();

  }, []);

  const cards = [

    {
      id: 1,
      title: "Total Revenue",
      value: `₹${report.totalRevenue}`,
      icon: <FaRupeeSign />,
      color: "#10B981",
    },

    {
      id: 2,
      title: "Products Sold",
      value: report.totalProductsSold,
      icon: <FaShoppingCart />,
      color: "#2563EB",
    },

    {
      id: 3,
      title: "Customers",
      value: report.totalCustomers,
      icon: <FaUsers />,
      color: "#F59E0B",
    },

    {
      id: 4,
      title: "Services",
      value: report.totalServices,
      icon: <FaTools />,
      color: "#8B5CF6",
    },

  ];

  return (

    <div className="summary-cards">

      {cards.map((card) => (

        <div
          className="summary-card"
          key={card.id}
        >

          <div
            className="summary-icon"
            style={{
              background: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="summary-info">

            <h4>{card.title}</h4>

            <h2>{card.value}</h2>

          </div>

        </div>

      ))}

    </div>

  );

};

export default SummaryCards;