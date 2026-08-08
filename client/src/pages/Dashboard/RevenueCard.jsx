import React, { useEffect, useState } from "react";
import "./RevenueCard.css";
import { FaArrowUp, FaRupeeSign } from "react-icons/fa";
import { getReports } from "../../services/reportService";

const RevenueCard = () => {

  const [report, setReport] = useState({
    totalRevenue: 0,
    totalServices: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        setReport(res.data);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchRevenue();

  }, []);

  return (

    <div className="revenue-card">

      <div className="revenue-header">

        <div>

          <h3>💰 Revenue Overview</h3>

          <p>Live Business Summary</p>

        </div>

        <div className="revenue-icon">

          <FaRupeeSign />

        </div>

      </div>

      {loading ? (

        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Loading Revenue...
        </div>

      ) : (

        <>

          <div className="revenue-body">

            <div className="revenue-item">

              <span>Total Revenue</span>

              <h2>
                ₹{Number(report.totalRevenue || 0).toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="revenue-item">

              <span>Completed Services</span>

              <h3>{report.totalServices}</h3>

            </div>

            <div className="revenue-item">

              <span>Total Customers</span>

              <h3>{report.totalCustomers}</h3>

            </div>

            <div className="revenue-item">

              <span>Products Sold</span>

              <h3>{report.totalProductsSold}</h3>

            </div>

          </div>

          <div className="growth">

            <FaArrowUp />

            <span>
              Revenue is calculated automatically from completed services.
            </span>

          </div>

        </>

      )}

    </div>

  );

};

export default RevenueCard;