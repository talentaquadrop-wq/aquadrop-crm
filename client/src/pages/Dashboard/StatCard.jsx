import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, growth, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>

      <div className="stat-content">
        <h4>{title}</h4>
        <h2>{value}</h2>
        <p>{growth}</p>
      </div>
    </div>
  );
};

export default StatCard;