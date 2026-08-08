import React, { useState } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const verifyOTP = async () => {
    try {
      const res = await api.post(
        "/auth/verify-otp",
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
    <div>
      <div>
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