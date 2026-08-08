import React, { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaTools,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import { getDashboardStats } from "../../services/dashboardService";

export default function RecentActivities() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {

    try {

      const res = await getDashboardStats();

      if (res.success) {

        const data = res.data;

        let allActivities = [];

        // ==========================
        // Recent Leads
        // ==========================

        (data.recentLeads || []).forEach((lead) => {

          allActivities.push({

            id: `lead-${lead._id}`,

            icon: <FaUserPlus />,

            title: lead.name,

            subtitle: "New Lead Added",

            time: new Date(
              lead.createdAt
            ).toLocaleDateString(),

            color: "#2563EB",

            createdAt: lead.createdAt,

          });

        });

        // ==========================
        // Recent Customers
        // ==========================

        (data.recentCustomers || []).forEach((customer) => {

          allActivities.push({

            id: `customer-${customer._id}`,

            icon: <FaCheckCircle />,

            title: customer.name,

            subtitle: "New Customer Added",

            time: new Date(
              customer.createdAt
            ).toLocaleDateString(),

            color: "#10B981",

            createdAt: customer.createdAt,

          });

        });

        // ==========================
        // Recent Installations
        // ==========================

        (data.recentInstallations || []).forEach((installation) => {

          allActivities.push({

            id: `installation-${installation._id}`,

            icon: <FaTools />,

            title: installation.customer,

            subtitle: "Installation Scheduled",

            time: new Date(
              installation.createdAt
            ).toLocaleDateString(),

            color: "#8B5CF6",

            createdAt: installation.createdAt,

          });

        });

        // ==========================
        // Recent Services
        // ==========================

        (data.recentServices || []).forEach((service) => {

          allActivities.push({

            id: `service-${service._id}`,

            icon: <FaClipboardList />,

            title: service.customer,

            subtitle: "Service Request",

            time: new Date(
              service.createdAt
            ).toLocaleDateString(),

            color: "#F59E0B",

            createdAt: service.createdAt,

          });

        });

        // ==========================
        // Latest First
        // ==========================

        allActivities.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setActivities(allActivities.slice(0, 8));

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchActivities();

  }, []);

  return (

    <div className="dashboard-box">

      <div className="box-header">

        <h3>📋 Recent Activities</h3>

        <span>{activities.length} Activities</span>

      </div>

      {loading ? (

        <div
          style={{
            padding: "35px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Loading...
        </div>

      ) : activities.length === 0 ? (

        <div
          style={{
            padding: "35px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          📋
          <br />
          <br />
          No Recent Activities Found
        </div>

      ) : (

        activities.map((item) => (

          <div
            className="activity-card"
            key={item.id}
          >

            <div
              className="activity-left"
              style={{
                borderLeft: `4px solid ${item.color}`,
              }}
            >

              <div
                className="activity-icon"
                style={{
                  background: item.color,
                }}
              >
                {item.icon}
              </div>

              <div>

                <h4>{item.title}</h4>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  {item.subtitle}
                </p>

              </div>

            </div>

            <span className="time-badge">
              {item.time}
            </span>

          </div>

        ))

      )}

    </div>

  );

}