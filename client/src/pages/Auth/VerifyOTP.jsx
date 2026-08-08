import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(res.data.message);

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "OTP Verification Failed"
      );
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <h2>Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter 6 Digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button onClick={verifyOTP}>
          Verify OTP
        </button>

      </div>
    </div>
  );
};

export default VerifyOTP;