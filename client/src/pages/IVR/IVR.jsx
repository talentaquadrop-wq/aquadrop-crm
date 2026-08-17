import React, { useState } from "react";

import {
  FaPhoneAlt,
  FaPhoneVolume,
  FaSyncAlt,
  FaHeadset,
  FaPlug,
  FaHistory,
  FaCircle,
} from "react-icons/fa";

import "./IVR.css";

const IVR = () => {
  // =========================================
  // IVR CONNECTION STATUS
  // =========================================

  const [ivrConnected, setIvrConnected] = useState(false);

  // =========================================
  // ROUTING MODE
  // =========================================

  const [routingMode, setRoutingMode] =
    useState("Round Robin");

  return (
    <div className="ivr-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="ivr-header">

        <div>
          <h1>IVR Management</h1>

          <p>
            Configure your IVR integration,
            call routing and telecaller assignment.
          </p>
        </div>

        <div
          className={`ivr-status ${
            ivrConnected
              ? "active"
              : "inactive"
          }`}
        >
          <FaCircle />

          {ivrConnected
            ? "IVR Connected"
            : "Not Connected"}
        </div>

      </div>


      {/* =====================================
          IVR PROVIDER
      ====================================== */}

      <div className="ivr-main-grid">

        <div className="ivr-card">

          <div className="card-title">

            <div>
              <FaPlug />

              <h2>IVR Provider</h2>
            </div>

          </div>


          {!ivrConnected ? (

            <div className="empty-provider">

              <div className="empty-icon">
                <FaPhoneAlt />
              </div>

              <h3>
                No IVR Provider Connected
              </h3>

              <p>
                Connect your IVR provider to
                receive and manage incoming calls
                inside the CRM.
              </p>

              <button
                type="button"
                className="connect-provider-btn"
                onClick={() =>
                  setIvrConnected(true)
                }
              >
                <FaPlug />

                Connect IVR Provider
              </button>

            </div>

          ) : (

            <div className="connected-provider">

              <div className="provider-connected-icon">
                <FaPhoneVolume />
              </div>

              <h3>
                IVR Provider Connected
              </h3>

              <p>
                Provider integration is active.
              </p>

              <button
                type="button"
                className="disconnect-provider-btn"
                onClick={() =>
                  setIvrConnected(false)
                }
              >
                Disconnect
              </button>

            </div>

          )}

        </div>


        {/* =====================================
            CALL ROUTING
        ====================================== */}

        <div className="ivr-card">

          <div className="card-title">

            <div>
              <FaSyncAlt />

              <h2>Call Routing</h2>
            </div>

          </div>


          <p className="routing-description">
            Select how incoming calls should
            be assigned to available telecallers.
          </p>


          <div className="routing-options">

            <button
              type="button"
              className={
                routingMode === "Round Robin"
                  ? "routing-option selected"
                  : "routing-option"
              }
              onClick={() =>
                setRoutingMode("Round Robin")
              }
            >
              <h3>
                Round Robin
              </h3>

              <p>
                Distribute calls equally among
                available telecallers.
              </p>

            </button>


            <button
              type="button"
              className={
                routingMode === "Sequential"
                  ? "routing-option selected"
                  : "routing-option"
              }
              onClick={() =>
                setRoutingMode("Sequential")
              }
            >
              <h3>
                Sequential
              </h3>

              <p>
                Route calls based on a predefined
                telecaller order.
              </p>

            </button>


            <button
              type="button"
              className={
                routingMode === "Manual"
                  ? "routing-option selected"
                  : "routing-option"
              }
              onClick={() =>
                setRoutingMode("Manual")
              }
            >
              <h3>
                Manual Assignment
              </h3>

              <p>
                Assign incoming calls manually
                from the CRM.
              </p>

            </button>

          </div>


          <div className="selected-routing">

            <strong>
              Current Routing:
            </strong>

            <span>
              {routingMode}
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          TELECALLERS
      ====================================== */}

      <div className="ivr-card">

        <div className="card-title">

          <div>
            <FaHeadset />

            <h2>Telecaller Assignment</h2>
          </div>

        </div>


        <div className="empty-state">

          <div className="empty-icon">
            <FaHeadset />
          </div>

          <h3>
            No Telecallers Available
          </h3>

          <p>
            Telecallers will appear here from
            the Employees section once they are
            assigned the Telecaller role.
          </p>

        </div>

      </div>


      {/* =====================================
          CALL HISTORY
      ====================================== */}

      <div className="ivr-card">

        <div className="card-title">

          <div>
            <FaHistory />

            <h2>Call History</h2>
          </div>

        </div>


        <div className="empty-state">

          <div className="empty-icon">
            <FaPhoneAlt />
          </div>

          <h3>
            No Call History Available
          </h3>

          <p>
            Incoming and outgoing call records
            will appear here after the IVR
            provider is connected.
          </p>

        </div>

      </div>

    </div>
  );
};

export default IVR;