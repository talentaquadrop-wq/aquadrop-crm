import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import WelcomeSection from "./WelcomeSection";
import StatCard from "./StatCard";
import Charts from "./Charts";
import QuickActions from "./QuickActions";
import RecentActivities from "./RecentActivities";
import TodayInstallations from "./TodayInstallations";
import LowStock from "./LowStock";
import RecentCustomers from "./RecentCustomers";
import RevenueCard from "./RevenueCard";

import api from "../../services/api";

import {
  FaUsers,
  FaUserFriends,
  FaTools,
  FaClock,
  FaCheckCircle,
  FaRupeeSign,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalInstallations: 0,
    pendingServices: 0,
    completedServices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Same API connection used by Leads page
      const response = await api.get("/dashboard");

      console.log("Dashboard Response:", response.data);

      if (response.data.success) {
        const data = response.data.data;

        setStats({
          totalLeads: data.totalLeads ?? 0,
          totalCustomers: data.totalCustomers ?? 0,
          totalInstallations: data.totalInstallations ?? 0,
          pendingServices: data.pendingServices ?? 0,
          completedServices: data.completedServices ?? 0,
        });
      }
    } catch (error) {
      console.error(
        "Dashboard Stats Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your Aqua Drop business operations.</p>
        </div>

        <div className="dashboard-date">
          Today
        </div>
      </div>

      <WelcomeSection />

      {/* STATISTICS */}

      <section className="stats-grid">

        <StatCard
          title="Total Leads"
          value={loading ? "..." : stats.totalLeads}
          growth="Live"
          icon={<FaUsers />}
          color="#2563EB"
        />

        <StatCard
          title="Customers"
          value={loading ? "..." : stats.totalCustomers}
          growth="Live"
          icon={<FaUserFriends />}
          color="#059669"
        />

        <StatCard
          title="Installations"
          value={loading ? "..." : stats.totalInstallations}
          growth="Live"
          icon={<FaTools />}
          color="#7C3AED"
        />

        <StatCard
          title="Pending Services"
          value={loading ? "..." : stats.pendingServices}
          growth="Live"
          icon={<FaClock />}
          color="#D97706"
        />

        <StatCard
          title="Completed Services"
          value={loading ? "..." : stats.completedServices}
          growth="Live"
          icon={<FaCheckCircle />}
          color="#16A34A"
        />

        <StatCard
          title="Revenue"
          value="₹0"
          growth="Live"
          icon={<FaRupeeSign />}
          color="#DC2626"
        />

      </section>

      {/* BUSINESS OVERVIEW */}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Business Overview</h2>
            <p>Sales and business performance summary</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <Charts />
        </div>
      </section>

      {/* QUICK ACTIONS */}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Frequently used actions</p>
          </div>
        </div>

        <QuickActions />
      </section>

      {/* TODAY'S OPERATIONS */}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Today's Operations</h2>
            <p>Activities that need your attention</p>
          </div>
        </div>

        <div className="bottom-grid">

          <div className="dashboard-panel">
            <RecentActivities />
          </div>

          <div className="dashboard-panel">
            <TodayInstallations />
          </div>

          <div className="dashboard-panel">
            <LowStock />
          </div>

        </div>
      </section>

      {/* CUSTOMERS + REVENUE */}

      <section className="dashboard-lower-grid">

        <div className="dashboard-panel">
          <RecentCustomers />
        </div>

        <div className="dashboard-panel">
          <RevenueCard />
        </div>

      </section>

    </div>
  );
};

export default Dashboard;