import React, { useEffect, useState } from "react";
import "./RevenueChart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getReports } from "../../services/reportService";

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RevenueChart = () => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        const monthlyData = (res.data.monthlyRevenue || []).map((item) => ({
          month: monthNames[item._id.month],
          revenue: item.revenue,
        }));

        setChartData(monthlyData);

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

    <div className="chart-card">

      <h3>📈 Revenue Trend</h3>

      {loading ? (

        <div
          style={{
            height: 320,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#64748b",
          }}
        >
          Loading Revenue...
        </div>

      ) : chartData.length === 0 ? (

        <div
          style={{
            height: 320,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          No Revenue Data Available
        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={4}
              dot={{
                r: 5,
              }}
              activeDot={{
                r: 8,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      )}

    </div>

  );

};

export default RevenueChart;