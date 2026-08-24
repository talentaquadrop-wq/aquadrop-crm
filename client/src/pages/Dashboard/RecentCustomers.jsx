import React, { useEffect, useState } from "react";
import "./RecentCustomers.css";
import { getCustomers } from "./Services/CustomerService";
const RecentCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH RECENT CUSTOMERS
  // ==========================================

  const fetchRecentCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers();

      if (response?.success) {
        const customerData = response.data || [];

        // Latest customers first
        const recentCustomers = [...customerData]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
          .slice(0, 5);

        setCustomers(recentCustomers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("❌ Recent Customers Error:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentCustomers();
  }, []);

  // ==========================================
  // VIEW ALL
  // ==========================================

  const handleViewAll = () => {
    window.location.href = "/customers";
  };

  return (
    <div className="customers-card">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="customers-header">

        <div className="customers-title">
          <h3>Recent Customers</h3>
          <p>Latest customers added to your system</p>
        </div>

        <button
          type="button"
          className="view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>

      </div>

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading ? (

        <div className="recent-customers-message">
          Loading recent customers...
        </div>

      ) : customers.length === 0 ? (

        /* ==========================================
           NO DATA
        ========================================== */

        <div className="recent-customers-message">
          No recent customers found
        </div>

      ) : (

        /* ==========================================
           CUSTOMER TABLE
        ========================================== */

        <div className="customers-table-wrapper">

          <table className="customers-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {customers.map((customer) => {

                const customerName =
                  customer.name ||
                  customer.customerName ||
                  "Unknown Customer";

                const phone =
                  customer.phone ||
                  customer.mobile ||
                  customer.contactNumber ||
                  "-";

                const location =
                  customer.city ||
                  customer.location ||
                  customer.address ||
                  "-";

                const status =
                  customer.status ||
                  "Active";

                const image =
                  customer.image ||
                  customer.profileImage ||
                  customer.photo ||
                  null;

                return (
                  <tr key={customer._id || customer.id}>

                    {/* CUSTOMER */}

                    <td className="customer-info">

                      {image ? (
                        <img
                          src={image}
                          alt={customerName}
                          className="customer-image"
                        />
                      ) : (
                        <div className="customer-avatar">
                          {customerName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <span className="customer-name">
                        {customerName}
                      </span>

                    </td>

                    {/* PHONE */}

                    <td>
                      {phone}
                    </td>

                    {/* LOCATION */}

                    <td>
                      {location}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${String(
                          status
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default RecentCustomers;