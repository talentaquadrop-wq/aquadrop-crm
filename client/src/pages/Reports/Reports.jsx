import React from "react";
import "./Reports.css";

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
    <div className="reports-page">

      {/* =========================
          REPORT HEADER
      ========================== */}

      <ReportHeader />

      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <SummaryCards />

      {/* =========================
          FILTERS
      ========================== */}

      <ReportFilters />

      {/* =========================
          CHARTS
      ========================== */}

      <div className="reports-chart-grid">
        <RevenueChart />

        <SalesChart />

        <SalesCategoryChart />
      </div>

      {/* =========================
          BOTTOM CARDS
      ========================== */}

      <div className="reports-bottom-grid">
        <TopProducts />

        <RecentReports />
      </div>

    </div>
  );
}