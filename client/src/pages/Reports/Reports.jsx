import React from "react";
import "./Reports.css";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Navbar from "../../components/layout/Navbar/Navbar";

import ReportHeader from "./ReportHeader";
import SummaryCards from "./SummaryCards";
import ReportFilters from "./ReportFilters";

import RevenueChart from "./RevenueChart";
import SalesChart from "./SalesChart";
import SalesCategoryChart from "./SalesCategoryChart";

import TopProducts from "./TopProducts";
import RecentReports from "./RecentReports";

export default function Reports() {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="reports-page">

          <ReportHeader />

          <SummaryCards />

          <ReportFilters />

          {/* Charts */}

          <div className="reports-chart-grid">

            <RevenueChart />

            <SalesChart />

            <SalesCategoryChart />

          </div>

          {/* Bottom Cards */}

          <div className="reports-bottom-grid">

            <TopProducts />

            <RecentReports />

          </div>

        </div>

      </div>

    </div>
  );
}