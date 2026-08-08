import React from "react";
import "./AdminDashboard.css";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Navbar from "../../components/layout/Navbar/Navbar";

import DashboardCards from "./components/DashboardCards";
import RevenueChart from "./components/RevenueChart";
import SalesChart from "./components/SalesChart";
import InventoryChart from "./components/InventoryChart";
import DispatchChart from "./components/DispatchChart";
import RecentLeads from "./components/RecentLeads";
import RecentCustomers from "./components/RecentCustomers";
import RecentDispatch from "./components/RecentDispatch";
import RecentServices from "./components/RecentServices";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="admin-dashboard">

          <h1>Dashboard</h1>
          <p>Welcome Administrator 👋</p>

          <DashboardCards />

          <div className="chart-grid">
            <RevenueChart />
            <SalesChart />
            <InventoryChart />
            <DispatchChart />
          </div>

          <div className="table-grid">
            <RecentLeads />
            <RecentCustomers />
            <RecentDispatch />
            <RecentServices />
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;