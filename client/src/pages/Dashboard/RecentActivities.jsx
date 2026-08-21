import React, { useEffect, useState } from "react";

import {
  FaUserPlus,
  FaTools,
  FaCheckCircle,
  FaHeadset,
  FaUsers,
} from "react-icons/fa";

import "./RecentActivities.css";

const API_URL =
  import.meta.env.VITE_API_URL || "";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/dashboard`
          .replace(/([^:]\/)\/+/g, "$1"),
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setActivities(
          result.activities || []
        );
      }
    } catch (error) {
      console.error(
        "Recent Activities Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "lead":
        return <FaUserPlus />;

      case "customer":
        return <FaUsers />;

      case "installation":
        return <FaTools />;

      case "completed":
        return <FaCheckCircle />;

      case "service":
        return <FaHeadset />;

      default:
        return <FaUserPlus />;
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    const activityDate = new Date(date);
    const now = new Date();

    const diff =
      now.getTime() -
      activityDate.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  };

  return (
    <div className="recent-activities">

      <div className="activity-header">
        <div>
          <h3>Recent Activities</h3>
          <p>
            Latest updates from your business
          </p>
        </div>

        <button
          className="view-all-btn"
          onClick={fetchActivities}
        >
          Refresh
        </button>
      </div>

      <div className="activity-list">

        {loading ? (
          <div className="activity-empty">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            No recent activities found
          </div>
        ) : (
          activities.map(
            (activity, index) => (
              <div
                className="activity-row"
                key={
                  activity._id ||
                  `${activity.type}-${index}`
                }
              >
                <div
                  className={`activity-icon ${
                    activity.type || "default"
                  }`}
                >
                  {getActivityIcon(
                    activity.type
                  )}
                </div>

                <div className="activity-details">
                  <h4>
                    {activity.title}
                  </h4>

                  <p>
                    {activity.description}
                  </p>
                </div>

                <span className="activity-time">
                  {formatTime(
                    activity.createdAt
                  )}
                </span>
              </div>
            )
          )
        )}

      </div>

    </div>
  );
};

export default RecentActivities;