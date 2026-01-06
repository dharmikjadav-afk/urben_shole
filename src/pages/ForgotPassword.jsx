import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.email !== email) {
      setError("No account found with this email");
      return;
    }


    setMessage("Password reset link has been sent to your email (simulated).");
    setError("");
  };

  return (
    <section className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card" data-aos="zoom-in">
        <h2>Reset Password</h2>
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

          <button className="auth-btn">Send Reset Link</button>
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
