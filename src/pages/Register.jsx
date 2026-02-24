import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Login.css";

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
};

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // kept (not used)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();

    // Password strength validation
    if (!isStrongPassword(form.password)) {
      toast.error(
        "Password must include uppercase, lowercase, number & special character",
      );
      return;
    }

    // Password match validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        username: form.name.trim(),
        email: email,
        password: form.password,
      });

      const data = response.data;

      toast.success(data.message || "OTP sent to your email");

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      console.log("Register Error:", error.response?.data);

      const message =
        error.response?.data?.message || error.message || "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }; // ← THIS WAS MISSING IN YOUR CODE

  return (
    <section className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">
          Join <strong>UrbanSole</strong> and step into premium comfort
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              required
              placeholder=" "
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            <label>Full Name</label>
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              required
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <label>Email address</label>
          </div>

          {/* Password */}
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <label>Password</label>

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="password-rules">
            Must be at least 8 characters, include uppercase, lowercase, number,
            and special character.
          </div>

          {/* Confirm Password */}
          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder=" "
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <label>Confirm Password</label>

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </section>
  );
}

export default Register;
