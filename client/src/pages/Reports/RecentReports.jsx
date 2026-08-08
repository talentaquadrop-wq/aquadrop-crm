import React, { useEffect, useState } from "react";
import "./RecentReports.css";
import {
  FaFilePdf,
  FaFileExcel,
  FaDownload,
} from "react-icons/fa";

import { getReports } from "../../services/reportService";

const RecentReports = () => {

  const [reports, setReports] = useState([]);

  const fetchReports = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        setReports(res.data.recentReports || []);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchReports();

  }, []);

  return (

    <div className="recent-reports-card">

      <h3>Recent Reports</h3>

      {reports.length === 0 ? (

        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#777",
          }}
        >
          No Reports Available
        </div>

      ) : (

        reports.map((report) => (

          <div
            className="report-row"
            key={report.id}
          >

            <div className="report-left">

              <div
                className="report-icon"
                style={{
                  background:
                    report.type === "Customers"
                      ? "#2563EB"
                      : report.type === "Services"
                      ? "#10B981"
                      : report.type === "Installations"
                      ? "#F59E0B"
                      : "#EF4444",
                }}
              >
                {report.type === "Inventory" ? (
                  <FaFileExcel />
                ) : (
                  <FaFilePdf />
                )}
              </div>

              <div>

                <h4>{report.name}</h4>

                <p>
                  {new Date(report.date).toLocaleDateString()}
                </p>

              </div>

            </div>

            <button className="download-btn">

              <FaDownload />

            </button>

          </div>

        ))

      )}

    </div>

  );

};

export default RecentReports;