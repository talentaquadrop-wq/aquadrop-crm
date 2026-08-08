import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./Login.css";

// Vite Environment Variable Support
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLE_ROUTES = {
  Admin: "/dashboard",
  Manager: "/dashboard",
  Executive: "/leads",
  Sales: "/leads",
  Inventory: "/inventory",
  Dispatch: "/dispatch",
  Service: "/installations",
};

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const executeLogin = async (loginCredential, passwordCredential) => {
    if (!loginCredential || !passwordCredential) {
      alert("Please enter Username / Email and Password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        login: loginCredential,
        password: passwordCredential,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login Successful");

      const targetRoute = ROLE_ROUTES[user.role] || "/dashboard";
      navigate(targetRoute);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(login, password);
  };

  const handleDemoLogin = () => {
    const demoLogin = "admin";
    const demoPassword = "Admin@123";

    setLogin(demoLogin);
    setPassword(demoPassword);
    executeLogin(demoLogin, demoPassword);
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="bubbles">
          {[...Array(8)].map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <div className="brand">
          <h1>
            Aqua <span>Drop</span>
          </h1>

          <h3>CRM</h3>

          <h2>
            Smart Water Softener
            <br />
            Management System
          </h2>

          <p>
            Manage your leads, customers, installations, and services all in
            one place.
          </p>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">💧</div>
              <div>
                <h4>Lead Management</h4>
                <p>Track and convert customer leads efficiently.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <div>
                <h4>Inventory</h4>
                <p>Monitor stock and product availability.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛠</div>
              <div>
                <h4>Service Tracking</h4>
                <p>Manage installations and customer support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p>Sign in to continue to your Aqua Drop CRM</p>

          <form onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div className="input-group">
              <label htmlFor="login">Username / Email</label>
              <div className="input-box">
                <FaEnvelope className="input-icon" />
                <input
                  id="login"
                  type="text"
                  placeholder="Enter Username or Email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-box">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Demo Login */}
          <button
            type="button"
            className="demo-btn"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Demo Login
          </button>

          {/* Contact */}
          <p className="contact-admin">
            Don't have an account? <span>Contact Administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;