import React from "react";
import "./RecentCustomers.css";

const customers = [
  {
    id: 1,
    name: "Ravi Kumar",
    phone: "+91 9876543210",
    location: "Hyderabad",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 2,
    name: "Suresh Reddy",
    phone: "+91 9876501234",
    location: "Vijayawada",
    status: "Pending",
    image: "https://i.pravatar.cc/100?img=15",
  },
  {
    id: 3,
    name: "Karthik",
    phone: "+91 9988776655",
    location: "Guntur",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=18",
  },
  {
    id: 4,
    name: "Mahesh",
    phone: "+91 9123456789",
    location: "Warangal",
    status: "Inactive",
    image: "https://i.pravatar.cc/100?img=20",
  },
];

const RecentCustomers = () => {
  return (
    <div className="customers-card">

      <div className="customers-header">
        <h3>Recent Customers</h3>
        <button>View All</button>
      </div>

      <table>

        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {customers.map((customer) => (

            <tr key={customer.id}>

              <td className="customer-info">

                <img src={customer.image} alt={customer.name} />

                <span>{customer.name}</span>

              </td>

              <td>{customer.phone}</td>

              <td>{customer.location}</td>

              <td>

                <span
                  className={`status-badge ${customer.status.toLowerCase()}`}
                >
                  {customer.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentCustomers;