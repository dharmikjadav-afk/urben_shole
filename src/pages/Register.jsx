import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";

const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isStrongPassword(form.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const user = {
      name: form.name,
      email: form.email,
      password: form.password,
    };


    localStorage.setItem("user", JSON.stringify(user));


    navigate("/login");
  };

  return (
    <section className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card" data-aos="zoom-in">
        <h2>Create Account</h2>
        <p className="subtitle">
          Join <strong>UrbanSole</strong> and step into premium comfort
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

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

          <button className="auth-btn">Create Account</button>
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
