import React, { useEffect, useState } from "react";
import { FaTools, FaClock } from "react-icons/fa";

import "./TodayInstallations.css";

import { getInstallations } from "../../services/installationService";

const TodayInstallations = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayInstallations();
  }, []);

  const fetchTodayInstallations = async () => {
    try {
      setLoading(true);

      const response = await getInstallations();

      if (response.success) {
        const allInstallations = response.data || [];

        const today = new Date();

        const todayInstallations = allInstallations.filter(
          (installation) => {
            const installationDate = new Date(
              installation.installationDate ||
                installation.createdAt
            );

            return (
              installationDate.getDate() === today.getDate() &&
              installationDate.getMonth() === today.getMonth() &&
              installationDate.getFullYear() === today.getFullYear()
            );
          }
        );

        setInstallations(todayInstallations);
      }
    } catch (error) {
      console.error(
        "Today Installations Error:",
        error
      );
      setInstallations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "Not scheduled";

    const formattedDate = new Date(date);

    return formattedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="today-installations">
      <div className="installations-card-header">
        <div>
          <h3>Today's Installations</h3>
          <p>Scheduled installation activities</p>
        </div>

        <span className="installation-count">
          {loading ? "..." : installations.length}
        </span>
      </div>

      <div className="installations-list">
        {loading ? (
          <div className="installation-empty">
            Loading installations...
          </div>
        ) : installations.length === 0 ? (
          <div className="installation-empty">
            No installations scheduled for today
          </div>
        ) : (
          installations.map((item) => (
            <div
              className="today-installation-row"
              key={item._id}
            >
              <div className="installation-main">
                <div className="installation-icon">
                  <FaTools />
                </div>

                <div className="installation-details">
                  <h4>
                    {item.customer?.name ||
                      item.customerName ||
                      "Unknown Customer"}
                  </h4>

                  <p>
                    {item.product?.name ||
                      item.productName ||
                      "Installation"}
                  </p>
                </div>
              </div>

              <div className="installation-right">
                <div className="installation-time">
                  <FaClock />

                  <span>
                    {formatTime(
                      item.installationDate ||
                        item.scheduledDate ||
                        item.createdAt
                    )}
                  </span>
                </div>

                <span
                  className={`installation-status ${
                    item.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-") ||
                    "pending"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayInstallations;