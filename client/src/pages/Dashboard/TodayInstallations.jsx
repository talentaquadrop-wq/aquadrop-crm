import React, { useEffect, useState } from "react";
import { FaTools, FaClock } from "react-icons/fa";

import "./TodayInstallations.css";
import { getInstallations } from "../../services/InstallationService";

const TodayInstallations = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayInstallations();
  }, []);

  const fetchTodayInstallations = async () => {
    try {
      setLoading(true);

      const res = await getInstallations();

      if (res?.success && Array.isArray(res.data)) {
        const today = new Date().toDateString();

        const todayData = res.data
          .filter((item) => {
            const installationDate =
              item.installationDate ||
              item.date ||
              item.scheduledDate ||
              item.createdAt;

            return (
              installationDate &&
              new Date(installationDate).toDateString() === today
            );
          })
          .slice(0, 5);

        setInstallations(todayData);
      } else {
        setInstallations([]);
      }
    } catch (error) {
      console.error(
        "Today's Installations Error:",
        error
      );

      setInstallations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (item) => {
    if (item.time) return item.time;
    if (item.installationTime) return item.installationTime;

    const date =
      item.installationDate ||
      item.date ||
      item.scheduledDate;

    if (date) {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    return "-";
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

          installations.map((item, index) => (

            <div
              className="today-installation-row"
              key={item._id || item.id || index}
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
                      item.product ||
                      "-"}
                  </p>

                </div>

              </div>

              <div className="installation-right">

                <div className="installation-time">
                  <FaClock />
                  <span>{formatTime(item)}</span>
                </div>

                <span
                  className={`installation-status ${
                    (
                      item.status || "Scheduled"
                    ).toLowerCase()
                  }`}
                >
                  {item.status || "Scheduled"}
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