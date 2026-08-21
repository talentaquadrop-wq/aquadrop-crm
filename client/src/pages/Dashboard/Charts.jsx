import React, { useEffect, useState } from "react";
import "./Charts.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL =
  import.meta.env.VITE_API_URL || "";

const Charts = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/dashboard`
          .replace(/([^:]\/)\/+/g, "$1"),
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setLeadsData(
          result.monthlyLeads || []
        );

        setServicesData(
          result.monthlyServices || []
        );
      }
    } catch (error) {
      console.error("Charts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="charts-grid">

      {/* MONTHLY LEADS */}

      <div className="chart-card">

        <h3>Monthly Leads</h3>

        {loading ? (
          <div className="chart-empty">
            Loading chart...
          </div>
        ) : leadsData.length === 0 ? (
          <div className="chart-empty">
            No leads data available
          </div>
        ) : (

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={leadsData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="leads"
                stroke="#2563EB"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>


      {/* MONTHLY SERVICES */}

      <div className="chart-card">

        <h3>Monthly Services</h3>

        {loading ? (
          <div className="chart-empty">
            Loading chart...
          </div>
        ) : servicesData.length === 0 ? (
          <div className="chart-empty">
            No services data available
          </div>
        ) : (

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={servicesData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="services"
                stroke="#10B981"
                fill="#A7F3D0"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
};

export default Charts;