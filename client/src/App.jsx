import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===============================
// AUTH PAGES
// ===============================

import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ResetPassword from "./pages/Auth/ResetPassword";

// ===============================
// CRM PAGES
// ===============================

import Dashboard from "./pages/Dashboard/Dashboard";
import Leads from "./pages/Leads/Leads";
import Customers from "./pages/Customers/Customers";
import Inventory from "./pages/Inventory/Inventory";
import Dispatch from "./pages/Dispatch/Dispatch";
import Installations from "./pages/Installations/Installations";
import Services from "./pages/Services/Services";
import Reports from "./pages/Reports/Reports";
import Employees from "./pages/Employees/Employees";
import Quotations from "./pages/Quotations/Quotations";

// ===============================
// CALLS / IVR PAGE
// ===============================

import IVR from "./pages/IVR/IVR";

// ===============================
// LAYOUT
// ===============================

import Layout from "./components/layout/Layout";

// ===============================
// PROTECTED ROUTE
// ===============================

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            PUBLIC ROUTES
        ================================= */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* =================================
            PROTECTED CRM LAYOUT
        ================================= */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Customers */}
          <Route
            path="/customers"
            element={<Customers />}
          />

          {/* Leads */}
          <Route
            path="/leads"
            element={<Leads />}
          />

          {/* Quotations */}
          <Route
            path="/quotations"
            element={<Quotations />}
          />

          {/* Inventory */}
          <Route
            path="/inventory"
            element={<Inventory />}
          />

          {/* Dispatch */}
          <Route
            path="/dispatch"
            element={<Dispatch />}
          />

          {/* Installations */}
          <Route
            path="/installations"
            element={<Installations />}
          />

          {/* Services */}
          <Route
            path="/services"
            element={<Services />}
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={<Employees />}
          />

          {/* =================================
              CALLS / IVR MANAGEMENT
          ================================= */}

          <Route
            path="/calls"
            element={<IVR />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>


        {/* =================================
            404
        ================================= */}

        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h2>404 - Page Not Found</h2>

              <p>
                The page you are looking for does not exist.
              </p>
            </div>
          }
        />

      </Routes>


      {/* =================================
          TOAST
      ================================= */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </BrowserRouter>
  );
}

export default App;