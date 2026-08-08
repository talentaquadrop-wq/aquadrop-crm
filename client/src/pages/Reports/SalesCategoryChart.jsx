import React, { useEffect, useState } from "react";
import "./SalesCategoryChart.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getReports } from "../../services/reportService";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
];

const SalesCategoryChart = () => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        setChartData(res.data.categorySales || []);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCategories();

  }, []);

  return (

    <div className="chart-card">

      <h3>🥧 Product Category Distribution</h3>

      {loading ? (

        <div
          style={{
            height:320,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            color:"#64748b",
          }}
        >
          Loading...
        </div>

      ) : chartData.length === 0 ? (

        <div
          style={{
            height:320,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            color:"#64748b",
            fontSize:"16px",
          }}
        >
          No Category Data
        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={105}
              label
            >

              {chartData.map((item,index)=>(

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </div>

  );

};

export default SalesCategoryChart;