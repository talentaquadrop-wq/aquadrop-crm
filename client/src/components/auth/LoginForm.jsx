import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./LoginForm.css";
import InputField from "./InputField";
import Button from "../common/Button";

function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
  console.log(err.response);
  console.log(err.response?.data);

  alert(
    JSON.stringify(err.response?.data) || "Login Failed"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>

      <h2 className="login-title">
        Aqua Drop CRM
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: "20px",
        }}
      >
        Water Softener Management System
      </p>

      <InputField
        type="email"
        placeholder="Enter Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <InputField
        type="password"
        placeholder="Enter Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        type="submit"
        text={loading ? "Logging in..." : "Login"}
        disabled={loading}
      />

      <p className="forgot-password">
        Forgot Password?
      </p>

    </form>
  );
}

export default LoginForm;