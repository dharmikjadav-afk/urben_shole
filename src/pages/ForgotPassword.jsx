import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/api"; // use API function
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Call API from api.js
      const res = await forgotPassword(email);

      // Success message from backend or default
      setMessage(
        res.data?.message || "Password reset link has been sent to your email.",
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card" data-aos="zoom-in">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your registered email to reset your password
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setMessage("");
              }}
            />
            <label>Email address</label>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password?
          <Link to="/login"> Back to Login</Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
