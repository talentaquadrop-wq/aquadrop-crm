import React from "react";
import "./ReportFilters.css";
import { FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa";

const ReportFilters = () => {
  return (
    <div className="report-filters">

      <div className="filter-group">
        <FaCalendarAlt />
        <input type="date" />
      </div>

      <div className="filter-group">
        <FaCalendarAlt />
        <input type="date" />
      </div>

      <div className="filter-group">
        <FaFilter />
        <select>
          <option>All Reports</option>
          <option>Revenue</option>
          <option>Sales</option>
          <option>Inventory</option>
          <option>Services</option>
        </select>
      </div>

      <button className="generate-btn">
        <FaSearch />
        Generate
      </button>

    </div>
  );
};

export default ReportFilters;