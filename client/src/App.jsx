import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ResetPassword from "./pages/Auth/ResetPassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Leads from "./pages/Leads/Leads";
import Customers from "./pages/Customers/Customers";
import Inventory from "./pages/Inventory/Inventory";
import Dispatch from "./pages/Dispatch/Dispatch";
import Installations from "./pages/Installations/Installations";
import Services from "./pages/Services/Services";
import Reports from "./pages/Reports/Reports";
import Employees from "./pages/Employees/Employees";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Public Routes
        ========================== */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =========================
            Dashboard (All Logged Users)
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Leads
        ========================== */}

        <Route
          path="/leads"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Manager",
                "Executive",
                "Sales",
              ]}
            >
              <Leads />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Customers
        ========================== */}

        <Route
          path="/customers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Manager",
                "Executive",
                "Sales",
              ]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Inventory
        ========================== */}

        <Route
          path="/inventory"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Inventory",
              ]}
            >
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Dispatch
        ========================== */}

        <Route
          path="/dispatch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Inventory",
                "Dispatch",
              ]}
            >
              <Dispatch />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Installations
        ========================== */}

        <Route
          path="/installations"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Service",
              ]}
            >
              <Installations />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Services
        ========================== */}

        <Route
          path="/services"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Service",
              ]}
            >
              <Services />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Employees
        ========================== */}

        <Route
          path="/employees"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
              ]}
            >
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Reports
        ========================== */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
              ]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
  );
}

export default App;