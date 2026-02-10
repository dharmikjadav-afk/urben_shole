import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify"; // 🔹 Toast
import "./Login.css";

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
};

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

    // Password strength
    if (!isStrongPassword(form.password)) {
      toast.error(
        "Password must include uppercase, lowercase, number & special character",
      );
      return;
    }

    // Match password
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(api.register, {
        username: form.name,
        email: form.email,
        password: form.password,
      });

      const data = response.data;

      // Save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update context
      login(data.user);

      // Success notification
      toast.success("Account created successfully! Welcome to UrbanSole");

      // Redirect to Home
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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
