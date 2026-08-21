import React from "react";
import "./StatCard.css";

const StatCard = ({
  title,
  value,
  growth,
  icon,
  color = "#2563eb",
}) => {
  return (
    <div className="stat-card">

      <div
        className="stat-card-icon"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </div>

      <div className="stat-card-content">

        <p className="stat-card-title">
          {title}
        </p>

        <h2 className="stat-card-value">
          {value}
        </h2>

        <div className="stat-card-growth">
          <span className="growth-arrow">
            ↑
          </span>

          <span>
            {growth} from last month
          </span>
        </div>

      </div>

    </div>
  );
};

export default StatCard;