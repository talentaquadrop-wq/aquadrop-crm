import React from "react";
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

const leadsData = [
  { month: "Jan", leads: 80 },
  { month: "Feb", leads: 120 },
  { month: "Mar", leads: 100 },
  { month: "Apr", leads: 150 },
  { month: "May", leads: 180 },
  { month: "Jun", leads: 140 },
  { month: "Jul", leads: 200 },
  { month: "Aug", leads: 170 },
  { month: "Sep", leads: 160 },
  { month: "Oct", leads: 130 },
  { month: "Nov", leads: 150 },
  { month: "Dec", leads: 190 },
];

const servicesData = [
  { month: "Jan", services: 50 },
  { month: "Feb", services: 80 },
  { month: "Mar", services: 120 },
  { month: "Apr", services: 90 },
  { month: "May", services: 100 },
  { month: "Jun", services: 110 },
  { month: "Jul", services: 130 },
  { month: "Aug", services: 170 },
  { month: "Sep", services: 120 },
  { month: "Oct", services: 90 },
  { month: "Nov", services: 110 },
  { month: "Dec", services: 140 },
];

const Charts = () => {
  return (
    <div className="charts-grid">

      {/* Monthly Leads */}

      <div className="chart-card">

        <h3>Monthly Leads</h3>

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

      </div>

      {/* Monthly Services */}

      <div className="chart-card">

        <h3>Monthly Services</h3>

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

      </div>

    </div>
  );
};

export default Charts;