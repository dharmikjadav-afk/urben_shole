import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "./VerifyOtp.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // ================= REDIRECT IF NO EMAIL =================
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please register again.");
      navigate("/register");
    }
  }, [email, navigate]);

  // ================= TIMER =================
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(api.verifyOtp, {
        email,
        otp,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Update AuthContext (auto login)
      login(res.data.user);

      toast.success("Email verified successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResend = async () => {
    try {
      setResendLoading(true);

      await axios.post(api.resendOtp, { email });

      setTimeLeft(600); // Reset full timer
      setOtp("");

      toast.success("New OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  // Allow resend after 1 minute
  const resendAvailable = timeLeft <= 540;
  const resendCountdown = timeLeft > 540 ? timeLeft - 540 : 0;

  return (
    <section className="otp-wrapper">
      <div className="otp-card">
        <h2>Email Verification</h2>
        <p className="otp-subtitle">
          OTP sent to <strong>{email}</strong>
        </p>

        {/* OTP INPUT */}
        <input
          type="text"
          maxLength="6"
          className="otp-input"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        {/* TIMER */}
        {timeLeft > 0 ? (
          <p className="otp-timer">
            OTP expires in: <span>{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="otp-expired">OTP expired. Please resend OTP.</p>
        )}

        {/* VERIFY BUTTON */}
        <button
          className="otp-btn"
          onClick={handleVerify}
          disabled={loading || timeLeft === 0}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND BUTTON */}
        <button
          className="resend-btn"
          onClick={handleResend}
          disabled={!resendAvailable || resendLoading}
        >
          {resendLoading
            ? "Sending..."
            : resendAvailable
              ? "Resend OTP"
              : `Resend in ${formatTime(resendCountdown)}`}
        </button>
      </div>
    </section>
  );
}

export default VerifyOtp;
