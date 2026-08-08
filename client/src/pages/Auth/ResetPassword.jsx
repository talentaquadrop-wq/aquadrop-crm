import React, { useState } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const resetPassword = async () => {
    try {
      const res = await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Password Reset Failed"
      );
    }
  };

  return (
    <div>
      <div>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button onClick={resetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;