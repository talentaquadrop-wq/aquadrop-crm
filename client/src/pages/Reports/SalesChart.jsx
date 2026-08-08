import React, { useEffect, useState } from "react";
import "./SalesChart.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

const SalesChart = () => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        const data = (res.data.monthlySales || []).map((item) => ({
          month: monthNames[item._id.month],
          sales: item.sales,
        }));

        setChartData(data);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchSales();

  }, []);

  return (

    <div className="chart-card">

      <h3>📊 Monthly Installations</h3>

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
          Loading...
        </div>

      ) : chartData.length === 0 ? (

        <div
          style={{
            height: 320,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#64748b",
          }}
        >
          No Installation Data
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="sales"
              fill="#10B981"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      )}

    </div>

  );

};

export default SalesChart;