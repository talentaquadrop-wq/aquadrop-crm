import React, { useEffect, useState } from "react";

import {
  FaPhoneAlt,
  FaPhoneVolume,
  FaSyncAlt,
  FaHeadset,
  FaPlug,
  FaHistory,
  FaCircle,
  FaUsers,
  FaSave,
  FaUserCheck,
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import {
  getIVRConfig,
  saveIVRConfig,
  disconnectIVR,
} from "../../services/ivrService";

import {
  getCalls,
} from "../../services/callService";

import "./IVR.css";

const IVR = () => {
  // =========================================
  // IVR CONFIGURATION
  // =========================================

  const [ivrConnected, setIvrConnected] =
    useState(false);

  const [ivrProvider, setIvrProvider] =
    useState("");

  const [ivrNumber, setIvrNumber] =
    useState("");

  const [routingMode, setRoutingMode] =
    useState("Round Robin");

  // =========================================
  // EMPLOYEES
  // =========================================

  const [employees, setEmployees] =
    useState([]);

  const [selectedExecutives, setSelectedExecutives] =
    useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(false);

  // =========================================
  // CALL HISTORY
  // =========================================

  const [calls, setCalls] =
    useState([]);

  const [loadingCalls, setLoadingCalls] =
    useState(false);

  // =========================================
  // GENERAL
  // =========================================

  const [loadingConfig, setLoadingConfig] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    loadIVRData();
    fetchExecutives();
    fetchCalls();
  }, []);


  // =========================================
  // LOAD IVR CONFIG
  // =========================================

  const loadIVRData = async () => {
    try {
      setLoadingConfig(true);

      const response =
        await getIVRConfig();

      const config =
        response?.config;

      if (!config) {
        return;
      }

      setIvrConnected(
        config.isConnected || false
      );

      setIvrProvider(
        config.provider || ""
      );

      setIvrNumber(
        config.ivrNumber || ""
      );

      setRoutingMode(
        config.routingMode ||
        "Round Robin"
      );

      const executiveIds =
        config.selectedExecutives?.map(
          (employee) =>
            employee._id || employee
        ) || [];

      setSelectedExecutives(
        executiveIds
      );

    } catch (error) {
      console.error(
        "Failed to load IVR configuration:",
        error
      );

    } finally {
      setLoadingConfig(false);
    }
  };


  // =========================================
  // FETCH EXECUTIVES
  // =========================================

  const fetchExecutives = async () => {
    try {
      setLoadingEmployees(true);

      const response =
        await api.get("/employees");

      const data =
        response.data?.employees ||
        response.data ||
        [];

      const availableExecutives =
        data.filter(
          (employee) =>
            employee.isActive !== false &&
            [
              "Executive",
              "Sales",
              "Manager",
            ].includes(employee.role)
        );

      setEmployees(
        availableExecutives
      );

    } catch (error) {
      console.error(
        "Failed to fetch employees:",
        error
      );

    } finally {
      setLoadingEmployees(false);
    }
  };


  // =========================================
  // FETCH CALL HISTORY
  // =========================================

  const fetchCalls = async () => {
    try {
      setLoadingCalls(true);

      const response =
        await getCalls();

      setCalls(
        response?.calls || []
      );

    } catch (error) {
      console.error(
        "Failed to fetch calls:",
        error
      );

    } finally {
      setLoadingCalls(false);
    }
  };


  // =========================================
  // ENABLE / DISABLE EXECUTIVE
  // =========================================

  const toggleExecutive = (
    employeeId
  ) => {
    setSelectedExecutives((prev) => {
      if (
        prev.includes(employeeId)
      ) {
        return prev.filter(
          (id) => id !== employeeId
        );
      }

      return [
        ...prev,
        employeeId,
      ];
    });
  };


  // =========================================
  // SAVE IVR CONFIGURATION
  // =========================================

  const handleSaveConfiguration =
    async () => {

      if (!ivrProvider.trim()) {
        toast.error(
          "Please select an IVR provider"
        );
        return;
      }

      if (!ivrNumber.trim()) {
        toast.error(
          "Please enter IVR number"
        );
        return;
      }

      if (
        selectedExecutives.length === 0
      ) {
        toast.error(
          "Please select at least one executive"
        );
        return;
      }

      try {
        setSaving(true);

        const data = {
          provider: ivrProvider,
          ivrNumber,
          isConnected: true,
          routingMode,
          selectedExecutives,
        };

        const response =
          await saveIVRConfig(data);

        const config =
          response?.config;

        if (config) {

          setIvrConnected(
            config.isConnected
          );

          setIvrProvider(
            config.provider
          );

          setIvrNumber(
            config.ivrNumber
          );

          setRoutingMode(
            config.routingMode
          );

          const executiveIds =
            config.selectedExecutives?.map(
              (employee) =>
                employee._id || employee
            ) || [];

          setSelectedExecutives(
            executiveIds
          );
        }

        toast.success(
          "IVR configuration saved successfully"
        );

      } catch (error) {
        console.error(
          "Save IVR Error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
          "Failed to save IVR configuration"
        );

      } finally {
        setSaving(false);
      }
    };


  // =========================================
  // DISCONNECT IVR
  // =========================================

  const handleDisconnectIVR =
    async () => {

      try {
        setSaving(true);

        await disconnectIVR();

        setIvrConnected(false);

        toast.success(
          "IVR disconnected successfully"
        );

      } catch (error) {

        console.error(
          "Disconnect IVR Error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
          "Failed to disconnect IVR"
        );

      } finally {
        setSaving(false);
      }
    };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString();
  };


  // =========================================
  // FORMAT DURATION
  // =========================================

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) {
      return "00:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };


  // =========================================
  // LOADING
  // =========================================

  if (loadingConfig) {
    return (
      <div className="ivr-page">
        <div className="empty-state">
          <h3>
            Loading IVR Configuration...
          </h3>
        </div>
      </div>
    );
  }


  return (
    <div className="ivr-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="ivr-header">

        <div>
          <h1>
            IVR Management
          </h1>

          <p>
            Configure IVR, call routing,
            executive assignment and call history.
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
            ? "IVR Configured"
            : "Not Configured"}
        </div>

      </div>


      {/* =====================================
          MAIN GRID
      ====================================== */}

      <div className="ivr-main-grid">

        {/* IVR PROVIDER */}

        <div className="ivr-card">

          <div className="card-title">

            <div>
              <FaPlug />

              <h2>
                IVR Provider
              </h2>
            </div>

          </div>


          <div className="ivr-provider-form">

            <div className="form-group">

              <label>
                IVR Provider
              </label>

              <select
                value={ivrProvider}
                onChange={(e) =>
                  setIvrProvider(
                    e.target.value
                  )
                }
                disabled={saving}
              >

                <option value="">
                  Select Provider
                </option>

                <option value="Exotel">
                  Exotel
                </option>

                <option value="Ozonetel">
                  Ozonetel
                </option>

                <option value="Knowlarity">
                  Knowlarity
                </option>

                <option value="LeadNXT">
                  LeadNXT
                </option>

                <option value="MyOperator">
                  MyOperator
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                IVR Number
              </label>

              <input
                type="text"
                placeholder="Enter company IVR number"
                value={ivrNumber}
                onChange={(e) =>
                  setIvrNumber(
                    e.target.value
                  )
                }
                disabled={saving}
              />

            </div>


            {ivrConnected && (

              <button
                type="button"
                className="disconnect-provider-btn"
                onClick={
                  handleDisconnectIVR
                }
                disabled={saving}
              >

                {saving
                  ? "Please wait..."
                  : "Disconnect IVR"}

              </button>

            )}

          </div>

        </div>


        {/* CALL ROUTING */}

        <div className="ivr-card">

          <div className="card-title">

            <div>
              <FaSyncAlt />

              <h2>
                Call Routing
              </h2>
            </div>

          </div>

          <p className="routing-description">
            Select how incoming customer calls
            should be distributed to executives.
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
                setRoutingMode(
                  "Round Robin"
                )
              }
            >

              <h3>
                Round Robin
              </h3>

              <p>
                Calls will be distributed equally
                among selected executives.
              </p>

            </button>


            <button
              type="button"
              className={
                routingMode ===
                "Simultaneous Ring"
                  ? "routing-option selected"
                  : "routing-option"
              }
              onClick={() =>
                setRoutingMode(
                  "Simultaneous Ring"
                )
              }
            >

              <h3>
                Simultaneous Ring
              </h3>

              <p>
                All selected executives receive
                the call. First answer wins.
              </p>

            </button>


            <button
              type="button"
              className={
                routingMode ===
                "Department Wise"
                  ? "routing-option selected"
                  : "routing-option"
              }
              onClick={() =>
                setRoutingMode(
                  "Department Wise"
                )
              }
            >

              <h3>
                Department Wise
              </h3>

              <p>
                Calls are routed based on
                department configuration.
              </p>

            </button>

          </div>

        </div>

      </div>


      {/* =====================================
          EXECUTIVE ASSIGNMENT
      ====================================== */}

      <div className="ivr-card">

        <div className="card-title">

          <div>
            <FaUsers />

            <h2>
              Executive Assignment
            </h2>
          </div>

        </div>

        <p className="routing-description">
          Enable IVR access for executives who
          should receive incoming customer calls.
        </p>


        {loadingEmployees ? (

          <div className="empty-state">

            <h3>
              Loading Executives...
            </h3>

          </div>

        ) : employees.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <FaHeadset />
            </div>

            <h3>
              No Executives Available
            </h3>

            <p>
              Add active employees with Executive,
              Sales or Manager roles.
            </p>

          </div>

        ) : (

          <div className="executive-list">

            {employees.map((employee) => {

              const employeeId =
                employee._id ||
                employee.id;

              const isSelected =
                selectedExecutives.includes(
                  employeeId
                );

              return (

                <div
                  key={employeeId}
                  className={`executive-item ${
                    isSelected
                      ? "selected-executive"
                      : ""
                  }`}
                >

                  <div className="executive-info">

                    <div className="executive-avatar">

                      {employee.name
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <h3>
                        {employee.name}
                      </h3>

                      <p>
                        {employee.role}

                        {employee.department
                          ? ` • ${employee.department}`
                          : ""}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    className={
                      isSelected
                        ? "executive-enabled"
                        : "executive-disabled"
                    }
                    onClick={() =>
                      toggleExecutive(
                        employeeId
                      )
                    }
                    disabled={saving}
                  >

                    <FaUserCheck />

                    {isSelected
                      ? "Enabled"
                      : "Enable IVR"}

                  </button>

                </div>

              );
            })}

          </div>

        )}


        <div className="ivr-save-section">

          <button
            type="button"
            className="save-ivr-btn"
            onClick={
              handleSaveConfiguration
            }
            disabled={saving}
          >

            <FaSave />

            {saving
              ? "Saving..."
              : "Save IVR Configuration"}

          </button>

        </div>

      </div>


      {/* =====================================
          CALL HISTORY
      ====================================== */}

      <div className="ivr-card">

        <div className="card-title">

          <div>
            <FaHistory />

            <h2>
              Call History
            </h2>
          </div>

          <button
            type="button"
            className="refresh-calls-btn"
            onClick={fetchCalls}
          >
            <FaSyncAlt />

            Refresh

          </button>

        </div>


        {loadingCalls ? (

          <div className="empty-state">

            <h3>
              Loading Call History...
            </h3>

          </div>

        ) : calls.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <FaPhoneAlt />
            </div>

            <h3>
              No Call History Available
            </h3>

            <p>
              Incoming and outgoing calls will
              appear here after IVR integration.
            </p>

          </div>

        ) : (

          <div className="call-history-table-wrapper">

            <table className="call-history-table">

              <thead>

                <tr>

                  <th>
                    Customer
                  </th>

                  <th>
                    Phone Number
                  </th>

                  <th>
                    Direction
                  </th>

                  <th>
                    Executive
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Date & Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {calls.map((call) => (

                  <tr key={call._id}>

                    <td>
                      {call.customer?.name ||
                        call.lead?.name ||
                        call.customerName ||
                        "Unknown"}
                    </td>


                    <td>
                      {call.customerNumber}
                    </td>


                    <td>
                      {call.direction}
                    </td>


                    <td>
                      {call.assignedExecutive?.name ||
                        "Not Assigned"}
                    </td>


                    <td>

                      <span
                        className={`call-status ${
                          call.status
                            ?.toLowerCase()
                            .replace(
                              /\s/g,
                              "-"
                            )
                        }`}
                      >

                        {call.status}

                      </span>

                    </td>


                    <td>
                      {formatDuration(
                        call.duration
                      )}
                    </td>


                    <td>
                      {formatDateTime(
                        call.createdAt ||
                        call.startedAt
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default IVR;