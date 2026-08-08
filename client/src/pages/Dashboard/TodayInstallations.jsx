import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";

export default function TodayInstallations() {

  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstallations = async () => {

    try {

      const res = await getDashboardStats();

      if (res.success) {

        const today = new Date().toDateString();

        const list = (res.data.recentInstallations || []).filter(
          (item) =>
            new Date(item.installationDate).toDateString() === today
        );

        setInstallations(list);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchInstallations();

  }, []);

  return (

    <div className="dashboard-box">

      <div className="box-header">

        <h3>🔧 Today's Installations</h3>

        <span>{installations.length}</span>

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

      ) : installations.length === 0 ? (

        <div
          style={{
            padding: "35px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          🔧
          <br />
          <br />
          No Installations Scheduled Today
        </div>

      ) : (

        installations.map((item) => (

          <div
            className="activity-card"
            key={item._id}
          >

            <div className="activity-left">

              <div
                className="activity-icon"
                style={{
                  background: "#8B5CF6",
                }}
              >
                🔧
              </div>

              <div>

                <h4>{item.customer}</h4>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Technician : {item.technician}
                </p>

              </div>

            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "6px",
              }}
            >

              <span className="time-badge">

                {new Date(
                  item.installationDate
                ).toLocaleDateString()}

              </span>

              <span
                style={{
                  background: "#DCFCE7",
                  color: "#166534",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Scheduled
              </span>

            </div>

          </div>

        ))

      )}

    </div>

  );

}