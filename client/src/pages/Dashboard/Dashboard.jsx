import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import WelcomeSection from "./WelcomeSection";
import StatCard from "./StatCard";
import Charts from "./Charts";
import QuickActions from "./QuickActions";
import RecentActivities from "./RecentActivities";
import TodayInstallations from "./TodayInstallations";
import RevenueCard from "./RevenueCard";
import LowStock from "./LowStock";

import {
  FaUsers,
  FaUserFriends,
  FaTools,
  FaClock,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";

import { getDashboardStats } from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalInstallations: 0,
    pendingServices: 0,
    completedServices: 0,
    totalProducts: 0,
    lowStockProducts: [],
    recentLeads: [],
    recentCustomers: [],
    recentInstallations: [],
    recentServices: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardStats();

      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">

      {/* =========================
          Welcome
      ========================== */}

      <WelcomeSection
        pendingServices={stats.pendingServices}
        installations={stats.totalInstallations}
        lowStock={stats.lowStockProducts?.length || 0}
        totalLeads={stats.totalLeads}
      />

      {/* =========================
          KPI CARDS
      ========================== */}

      <div className="stats-grid">

        <StatCard
          title="Total Leads"
          value={loading ? "..." : stats.totalLeads}
          growth="+0%"
          icon={<FaUsers />}
          color="#2563EB"
        />

        <StatCard
          title="Customers"
          value={loading ? "..." : stats.totalCustomers}
          growth="+0%"
          icon={<FaUserFriends />}
          color="#10B981"
        />

        <StatCard
          title="Installations"
          value={loading ? "..." : stats.totalInstallations}
          growth="+0%"
          icon={<FaTools />}
          color="#8B5CF6"
        />

        <StatCard
          title="Pending Services"
          value={loading ? "..." : stats.pendingServices}
          growth="+0%"
          icon={<FaClock />}
          color="#F59E0B"
        />

        <StatCard
          title="Completed Services"
          value={loading ? "..." : stats.completedServices}
          growth="+0%"
          icon={<FaCheckCircle />}
          color="#16A34A"
        />

        <StatCard
          title="Products"
          value={loading ? "..." : stats.totalProducts}
          growth="+0%"
          icon={<FaBoxOpen />}
          color="#EF4444"
        />

      </div>

      {/* =========================
          CHARTS
      ========================== */}

      <Charts />

      {/* =========================
          QUICK ACTIONS
      ========================== */}

      <QuickActions />

      {/* =========================
          RECENT DATA
      ========================== */}

      <div className="bottom-grid">
        <RecentActivities />
        <TodayInstallations />
      </div>

      <div className="bottom-grid">
        <RevenueCard />
        <LowStock />
      </div>

    </div>
  );
};

export default Dashboard;