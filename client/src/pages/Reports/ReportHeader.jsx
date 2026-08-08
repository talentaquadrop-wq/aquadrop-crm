import React from "react";
import "./ReportHeader.css";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import exportPDF from "../../utils/pdfExport";

const ReportHeader = () => {
  return (
    <div className="report-header">

      <div className="header-left">
        <h2>Reports</h2>
        <p>Business Reports & Analytics</p>
      </div>

      <div className="header-buttons">

        <button className="excel-btn">
          <FaFileExcel />
          Export Excel
        </button>

        <button
          className="pdf-btn"
          onClick={exportPDF}
        >
          <FaFilePdf />
          Export PDF
        </button>

      </div>

    </div>
  );
};

export default ReportHeader;